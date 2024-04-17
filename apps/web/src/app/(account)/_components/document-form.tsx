"use client"

import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { StepperFormActions } from "@web/src/components/stepper-form-action"
import { buttonVariants } from "@web/src/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@web/src/components/ui/form"
import { Label } from "@web/src/components/ui/label"
import { useStepper } from "@web/src/components/ui/stepper"
import { UploadDropzone } from "@web/src/lib/uploadthing/uploadthing"
import { cn } from "@web/src/lib/utils"
import { UploadCloud } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface DocumentFormProps {
  // Props
}

const DocumentFormSchema = z.object({
  profileUrl: z.string().url({ message: "Profile image is required." }),
  documentUrl: z.string().url({ message: "Document image is required." }),
})

// Uploads the images to uploadthing and stores url
const DocumentForm: React.FC<DocumentFormProps> = ({}) => {
  const { nextStep } = useStepper()

  const form = useForm<z.infer<typeof DocumentFormSchema>>({
    resolver: zodResolver(DocumentFormSchema),
    defaultValues: {
      profileUrl: "",
      documentUrl: "",
    },
  })

  const onSubmit = (data: z.infer<typeof DocumentFormSchema>) => {
    /* nextStep() */
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="profileUrl"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center justify-center">
                  <Label className="w-full text-center">Profile Picture</Label>
                  <FormControl>
                    <UploadDropzone
                      appearance={{
                        container: "cursor-pointer size-56",
                        label: cn(
                          "text-foreground hover:text-foreground",
                          field.value && "hidden"
                        ),
                        allowedContent: cn(
                          "text-foreground/70",
                          field.value && "hidden"
                        ),
                        button: cn(
                          buttonVariants({ variant: "default", size: "sm" }),
                          "after:bg-primary data-[state=uploading]:bg-primary/70 disabled:opacity-100"
                        ),
                      }}
                      content={{
                        uploadIcon() {
                          if (field.value) {
                            return (
                              <Image
                                src={field.value}
                                width={200}
                                height={200}
                                className="h-24 w-auto rounded-md"
                                alt="Profile Image"
                              />
                            )
                          }
                          return <UploadCloud className="size-12" />
                        },
                      }}
                      endpoint="documentUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].url)
                        toast.success("Profile uploaded successful")
                      }}
                      onUploadError={() => {
                        toast.error("Profile upload failed!")
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profileUrl"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center justify-center">
                  <Label className="w-full text-center">
                    Passport / Citizenship / License
                  </Label>
                  <FormControl>
                    <UploadDropzone
                      appearance={{
                        container: "cursor-pointer size-56",
                        label: cn(
                          "text-foreground hover:text-foreground",
                          field.value && "hidden"
                        ),
                        allowedContent: cn(
                          "text-foreground/70",
                          field.value && "hidden"
                        ),
                        button: cn(
                          buttonVariants({ variant: "default", size: "sm" }),
                          "after:bg-primary data-[state=uploading]:bg-primary/70 disabled:opacity-100"
                        ),
                      }}
                      content={{
                        uploadIcon() {
                          if (field.value) {
                            return (
                              <Image
                                src={field.value}
                                width={200}
                                height={200}
                                className="h-24 w-auto rounded-md"
                                alt="Profile Image"
                              />
                            )
                          }
                          return <UploadCloud className="size-12" />
                        },
                      }}
                      endpoint="documentUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].url)
                        toast.success("Document uploaded successful")
                      }}
                      onUploadError={() => {
                        toast.error("Document upload failed!")
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />{" "}
        </div>
        <StepperFormActions />
      </form>
    </Form>
  )
}

export default DocumentForm
