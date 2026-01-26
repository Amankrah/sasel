'use client'

import { PortableText as PortableTextComponent, PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from 'sanity'
import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/sanity/lib/image'

interface PortableTextProps {
  value: PortableTextBlock[]
  className?: string
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-900">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="ml-4">{children}</li>,
    number: ({ children }) => <li className="ml-4">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    code: ({ children }) => (
      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = value?.href || ''
      const isExternal = href.startsWith('http')

      if (isExternal) {
        return (
          <a
            href={href}
            target={value?.blank ? '_blank' : undefined}
            rel={value?.blank ? 'noopener noreferrer' : undefined}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {children}
          </a>
        )
      }

      return (
        <Link href={href} className="text-blue-600 hover:text-blue-800 underline">
          {children}
        </Link>
      )
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null

      const imageUrl = urlForImage(value)?.width(800).url()

      if (!imageUrl) return null

      return (
        <figure className="my-6">
          <div className="relative w-full aspect-video">
            <Image
              src={imageUrl}
              alt={value.alt || ''}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

export default function PortableText({ value, className = '' }: PortableTextProps) {
  if (!value) return null

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <PortableTextComponent value={value} components={components} />
    </div>
  )
}
