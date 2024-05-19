import Link from "next/link"
import { buttonVariants } from "@web/src/components/ui/button"
import { CheckIcon } from "lucide-react"

export default function Home() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Find the Perfect Caretaker for Your Loved Ones
              </h1>
              <p className="text-foreground/50 mx-auto max-w-[700px] md:text-xl">
                Our platform connects you with experienced and vetted caretakers
                to provide compassionate care for your family.
              </p>
            </div>
            <div className="space-x-4">
              <Link
                className={buttonVariants({ variant: "default" })}
                href="/auth/signup"
              >
                Hire a Caretaker
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-foreground/5 container w-full py-12 md:py-24 lg:py-32">
        <div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Get Hired as a Caretaker
                </h2>
                <p className="text-foreground/60 max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join our network of experienced and vetted caretakers. Create
                  a profile, apply for jobs, and start making a difference in
                  the lives of those in need.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  className={buttonVariants({ variant: "default" })}
                  href="/auth/signup"
                >
                  Become a Caretaker
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container w-full py-12 md:py-24 lg:py-32">
        <div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-center space-y-4 text-right">
              <div className="flex flex-col items-end space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Post a Job
                </h2>
                <p className="text-foreground/60 max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Easily post a job for the care services you need. Our platform
                  connects you with qualified caretakers and handles the payment
                  process securely.
                </p>
              </div>
              <div className="ml-auto">
                <Link
                  className={buttonVariants({ variant: "default" })}
                  href="/auth/signup"
                >
                  Post a Job
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-foreground/5 container w-full py-12 md:py-24 lg:py-32">
        <div>
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Why Choose Our Platform?
            </h2>
            <p className="text-foreground/60 max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform offers a seamless and secure way to find and hire
              experienced caretakers for your loved ones.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-4">
                <CheckIcon className="mt-1 size-6" />
                <div>
                  <h3 className="text-lg font-medium">Vetted Caretakers</h3>
                  <p className="text-foreground/60">
                    All our caretakers go through a rigorous screening process
                    to ensure they meet our high standards.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckIcon className="mt-1 size-6" />
                <div>
                  <h3 className="text-lg font-medium">Secure Payments</h3>
                  <p className="text-foreground/60">
                    Pay for your caretaker services securely through our PayPal
                    integration.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckIcon className="mt-1 size-6" />
                <div>
                  <h3 className="text-lg font-medium">24/7 Support</h3>
                  <p className="text-foreground/60">
                    Our dedicated support team is available around the clock to
                    assist you with any questions or concerns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
