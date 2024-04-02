import { notFound } from "next/navigation"
import { allPages } from "@web/.contentlayer/generated"
import { Mdx } from "@web/src/components/mdx-components"

import "@web/src/styles/mdx.css"

import { Metadata } from "next"
import { siteConfig } from "@web/src/config/site"
import { absoluteUrl } from "@web/src/lib/utils"

interface PageProps {
  params: {
    slug: string[]
  }
}

async function getPageFromParams(params: { slug: string[] }) {
  const slug = params?.slug?.join("/")
  const page = allPages.find((page) => page.slugAsParams === slug)

  if (!page) {
    null
  }

  return page
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = await getPageFromParams(params)

  if (!page) {
    return {}
  }

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: "article",
      url: absoluteUrl(page.slug),
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [siteConfig.ogImage],
    },
  }
}

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  return allPages.map((page) => ({
    slug: page.slugAsParams.split("/"),
  }))
}

export default async function PagePage({ params }: PageProps) {
  const page = await getPageFromParams(params)

  if (!page) {
    notFound()
  }

  return (
    <article className="container max-w-3xl py-6 lg:py-12">
      <div className="space-y-4">
        <h1 className="inline-block text-4xl font-bold lg:text-5xl">
          {page.title}
        </h1>
        {page.description && (
          <p className="text-muted-foreground text-xl">{page.description}</p>
        )}
      </div>
      <hr className="my-4" />
      <Mdx code={page.body.code} />
    </article>
  )
}
