"use client"

import { useState } from "react"
import Image from "next/image"
import { StepperFormActions } from "@web/src/components/stepper-form-action"
import { buttonVariants } from "@web/src/components/ui/button"
import { Label } from "@web/src/components/ui/label"
import { useStepper } from "@web/src/components/ui/stepper"
import { UploadDropzone } from "@web/src/lib/uploadthing/uploadthing"
import { cn } from "@web/src/lib/utils"
import { UploadCloud } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

interface DocumentFormProps {
  // Props
}

const DocumentFormSchema = z.object({
  profileUrl: z.string().url(),
  documentUrl: z.string().url(),
})

// Uploads the images to uploadthing and stores url
const DocumentForm: React.FC<DocumentFormProps> = ({}) => {
  const { nextStep } = useStepper()

  const [imageUrl, setImageUrl] = useState<z.infer<typeof DocumentFormSchema>>({
    profileUrl: "",
    documentUrl: "",
  })

  return (
    <div>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
        <div className="flex flex-col items-center justify-center">
          <Label className="w-full text-center">Profile Picture</Label>
          <UploadDropzone
            appearance={{
              container: "cursor-pointer size-56",
              label: cn(
                "text-foreground hover:text-foreground",
                imageUrl.profileUrl && "hidden"
              ),
              allowedContent: cn(
                "text-foreground/70",
                imageUrl.profileUrl && "hidden"
              ),
              button: cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "after:bg-primary data-[state=uploading]:bg-primary/70 disabled:opacity-100"
              ),
            }}
            content={{
              uploadIcon() {
                if (imageUrl.profileUrl) {
                  return (
                    <Image
                      src={imageUrl.profileUrl}
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
              setImageUrl({ ...imageUrl, profileUrl: res[0].url })
              toast.success("Document uploaded successful")
            }}
            onUploadError={() => {
              toast.error("Document upload failed!")
            }}
          />
        </div>

        <div className="flex flex-col items-center justify-center">
          <Label className="w-full text-center">
            Passport / Citizenship / License
          </Label>
          <UploadDropzone
            appearance={{
              container: "cursor-pointer size-56",
              label: cn(
                "text-foreground hover:text-foreground",
                imageUrl.documentUrl && "hidden"
              ),
              allowedContent: cn(
                "text-foreground/70",
                imageUrl.documentUrl && "hidden"
              ),
              button: cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "after:bg-primary data-[state=uploading]:bg-primary/70 disabled:opacity-100"
              ),
            }}
            content={{
              uploadIcon() {
                if (imageUrl.documentUrl) {
                  return (
                    <Image
                      src={imageUrl.documentUrl}
                      width={200}
                      height={200}
                      className="h-20 w-auto rounded-md"
                      alt="Profile Image"
                    />
                  )
                }
                return <UploadCloud className="size-12" />
              },
            }}
            endpoint="documentUploader"
            onClientUploadComplete={(res) => {
              setImageUrl({ ...imageUrl, documentUrl: res[0].url })
              toast.success("Document uploaded successful")
            }}
            onUploadError={() => {
              toast.error("Document upload failed!")
            }}
          />
        </div>
      </div>
      <StepperFormActions />
    </div>
  )
}

export default DocumentForm
