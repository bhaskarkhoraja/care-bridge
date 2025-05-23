"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { setDocumentInfo } from "@web/src/actions/user"
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
import { UploadDropzone } from "@web/src/lib/uploadthing/uploadthing"
import { cn } from "@web/src/lib/utils"
import { DocumentFormSchema } from "api-contract/types"
import { UploadCloud } from "lucide-react"
import NProgress from "nprogress"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface DocumentFormProps {
  documentInfo: z.infer<typeof DocumentFormSchema> | undefined
}

// Uploads the images to uploadthing and stores url
const DocumentForm: React.FC<DocumentFormProps> = ({ documentInfo }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from")
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof DocumentFormSchema>>({
    resolver: zodResolver(DocumentFormSchema),
    defaultValues: {
      verified: documentInfo?.verified ?? null,
      profileUrl: documentInfo?.profileUrl ?? "",
      documentUrl: documentInfo?.documentUrl ?? "",
      policeReportUrl: documentInfo?.policeReportUrl ?? "",
    },
  })

  const onSubmit = async (data: z.infer<typeof DocumentFormSchema>) => {
    try {
      setLoading(true)
      const response = await setDocumentInfo(data)

      if (response.status === 422 || response.status === 500) {
        toast.error("Something went wrong!")
        return
      }
      toast.success("Profile completed", {
        description: "Your account will be verified within 2-3 days.",
      })
      NProgress.start()
      router.push(from ? from : "/user/family-member")
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setLoading(false)
    }
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
                          "after:bg-primary data-[state=uploading]:bg-primary/70 focus-within:ring-ring disabled:opacity-100"
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
            name="documentUrl"
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
                          "after:bg-primary data-[state=uploading]:bg-primary/70 focus-within:ring-ring disabled:opacity-100"
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
                                alt="Passport / Citizenship / License"
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
          />
          <FormField
            control={form.control}
            name="policeReportUrl"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center justify-center">
                  <Label className="w-full text-center">
                    Police Report Document
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
                          "after:bg-primary data-[state=uploading]:bg-primary/70 focus-within:ring-ring disabled:opacity-100"
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
                                alt="Police Report Document"
                              />
                            )
                          }
                          return <UploadCloud className="size-12" />
                        },
                      }}
                      endpoint="documentUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].url)
                        toast.success("Police report uploaded successful")
                      }}
                      onUploadError={() => {
                        toast.error("Police report upload failed!")
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
        </div>
        <StepperFormActions loading={loading} />
      </form>
    </Form>
  )
}

export default DocumentForm
