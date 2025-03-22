import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface NewConversationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => Promise<void>
}

export function NewConversationModal({ isOpen, onClose, onSubmit }: NewConversationModalProps) {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(name)
      setName('')
      onClose()
    } catch (error) {
      console.error('Failed to create conversation:', error)
      // You might want to show an error toast here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          onClose()
          setName('')
        }
      }}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            Give your conversation a name to help you find it later.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <Input
            placeholder='Enter conversation name...'
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isSubmitting) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            disabled={isSubmitting}
          />
        </div>
        <DialogFooter>
          <Button 
            variant='outline' 
            onClick={onClose} 
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!name.trim() || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
