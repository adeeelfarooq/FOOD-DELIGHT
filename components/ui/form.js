"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const formVariants = cva(
  "w-full space-y-2"
)

const Form = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(formVariants(), className)}
      {...props}
    />
  )
})
Form.displayName = "Form"

const FormFieldContext = React.createContext({})

const FormField = React.forwardRef(({ children, ...props }, ref) => {
  const [id] = React.useState(() => Math.random().toString(36).substring(2))

  return (
    <FormFieldContext.Provider value={{ id }}>
      <div ref={ref} {...props}>
        {children}
      </div>
    </FormFieldContext.Provider>
  )
})
FormField.displayName = "FormField"

const useFormField = () => {
  const context = React.useContext(FormFieldContext)
  if (!context) {
    throw new Error("useFormField must be used within a FormField")
  }
  return context
}

const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { id } = useFormField()

  return <div ref={ref} id={id} {...props} />
})
FormControl.displayName = "FormControl"

const FormFieldLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { id } = useFormField()

  return (
    <label
      ref={ref}
      htmlFor={id}
      className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
      {...props}
    />
  )
})
FormFieldLabel.displayName = "FormFieldLabel"

const FormFieldDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { id } = useFormField()

  return (
    <p
      ref={ref}
      id={`${id}-description`}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormFieldDescription.displayName = "FormFieldDescription"

const FormFieldMessage = React.forwardRef(({ className, ...props }, ref) => {
  const { id } = useFormField()
  const error = "" // You would typically get this from your form state

  if (!error) {
    return null
  }

  return (
    <p
      ref={ref}
      id={`${id}-error`}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {error}
    </p>
  )
})
FormFieldMessage.displayName = "FormFieldMessage"

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    />
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    />
  )
})
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormLabel,
  FormDescription,
  FormMessage,
  FormFieldLabel,
  FormFieldDescription,
  FormFieldMessage,
}
