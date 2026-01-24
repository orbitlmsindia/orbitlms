"use client"

import React, { useEffect, useRef } from 'react'
import { cn } from "@/lib/utils"
import { Bold, Italic, List, Underline, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Quote } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    className?: string
    placeholder?: string
}

export function RichTextEditor({ value, onChange, className, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [selectedImg, setSelectedImg] = React.useState<HTMLImageElement | null>(null)

    const handleClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement
        if (target.tagName === 'IMG') {
            setSelectedImg(target as HTMLImageElement)
            // Visually select
            target.style.outline = '2px solid var(--primary)'
        } else {
            if (selectedImg) {
                selectedImg.style.outline = 'none'
                setSelectedImg(null)
            }
        }
    }

    const resizeImage = (width: string) => {
        if (selectedImg) {
            selectedImg.style.width = width
            selectedImg.style.maxWidth = '100%'
            // Force aspect ratio to be maintained if height was set
            selectedImg.style.height = 'auto'
            // Trigger update
            if (editorRef.current) {
                onChange(editorRef.current.innerHTML)
            }
        }
    }

    // Sync only when value changes externally (and is different) to avoid cursor jumps
    useEffect(() => {
        if (editorRef.current) {
            if (editorRef.current.innerHTML !== value) {
                // Only update if the content is significantly different (e.g. init or reset)
                // This is a naive check; for a real robust editor, we'd need more logic.
                // But for this use case, it prevents wiping out work if parent re-renders unchanged value.
                if (value === "" && editorRef.current.innerHTML === "<br>") return;

                // If the editor is empty and value is provided, or if the values strictly mismatch and we aren't focused (to be safe)
                if (document.activeElement !== editorRef.current) {
                    editorRef.current.innerHTML = value || ""
                }
            }
        }
    }, [value])

    const handleInput = () => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML
            onChange(html)
        }
    }

    const execCommand = (command: string, arg: string | undefined = undefined) => {
        if (typeof document !== 'undefined') {
            document.execCommand(command, false, arg)
            editorRef.current?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items
        let hasImage = false

        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                hasImage = true
                e.preventDefault()
                const blob = item.getAsFile()
                if (blob) {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                        const img = document.createElement('img')
                        img.src = event.target?.result as string
                        img.style.maxWidth = '100%'
                        img.style.borderRadius = '8px'
                        img.style.marginTop = '1rem'
                        img.style.marginBottom = '1rem'
                        img.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)'

                        const selection = window.getSelection()
                        if (selection && selection.rangeCount > 0 && selection.anchorNode && editorRef.current?.contains(selection.anchorNode)) {
                            const range = selection.getRangeAt(0)
                            range.deleteContents()
                            range.insertNode(img)
                            range.collapse(false)
                        } else {
                            editorRef.current?.appendChild(img)
                        }
                        handleInput()
                    }
                    reader.readAsDataURL(blob)
                }
            }
        }
        // If no image, let default paste happen (text)
    }

    const ToolbarButton = ({ icon: Icon, command, arg, title }: { icon: any, command: string, arg?: string, title: string }) => (
        <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
            onClick={() => execCommand(command, arg)}
            title={title}
            type="button" // Prevent form submission
        >
            <Icon className="w-4 h-4" />
        </Button>
    )

    return (
        <div className={cn("border border-input rounded-md overflow-hidden bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 relative", className)}>
            {selectedImg && (
                <div className="absolute top-14 left-1/2 -translate-x-1/2 z-10 bg-card border shadow-lg rounded-full px-3 py-1 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">Image Size</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs rounded-full" onClick={() => resizeImage('25%')}>S</Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs rounded-full" onClick={() => resizeImage('50%')}>M</Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs rounded-full" onClick={() => resizeImage('75%')}>L</Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs rounded-full" onClick={() => resizeImage('100%')}>Full</Button>
                </div>
            )}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
                <ToolbarButton icon={Bold} command="bold" title="Bold" />
                <ToolbarButton icon={Italic} command="italic" title="Italic" />
                <ToolbarButton icon={Underline} command="underline" title="Underline" />
                <div className="w-px h-6 bg-border mx-1" />
                <ToolbarButton icon={Heading1} command="formatBlock" arg="<H2>" title="Heading 1" />
                <ToolbarButton icon={Heading2} command="formatBlock" arg="<H3>" title="Heading 2" />
                <div className="w-px h-6 bg-border mx-1" />
                <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
                <ToolbarButton icon={Quote} command="formatBlock" arg="<BLOCKQUOTE>" title="Quote" />
                <div className="w-px h-6 bg-border mx-1" />
                <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Align Left" />
                <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Align Center" />
                <ToolbarButton icon={AlignRight} command="justifyRight" title="Align Right" />
            </div>

            <div
                ref={editorRef}
                className="p-4 min-h-[200px] outline-none max-h-[500px] overflow-y-auto prose prose-sm dark:prose-invert max-w-none text-foreground placeholder:text-muted-foreground"
                contentEditable
                onInput={handleInput}
                onClick={handleClick}
                onPaste={handlePaste}
                spellCheck={false}
            />

            <div className="px-4 py-2 bg-muted/10 border-t text-[10px] text-muted-foreground flex justify-between">
                <span>Supports pasting images directly from clipboard (Ctrl+V)</span>
                <span>{value.length} chars</span>
            </div>
        </div>
    )
}
