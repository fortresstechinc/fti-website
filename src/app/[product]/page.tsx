import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productBySlug, products } from "@/content/products";
import { ContactFooter } from "@/components/chrome/ContactFooter";
import { ProductHero } from "@/components/product/ProductHero";
import { InAction } from "@/components/product/InAction";
import { CloseTheLoop, Specs } from "@/components/product/ProductSections";
import { ProductWalkthrough } from "@/components/product/ProductWalkthrough";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ product: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ product: string }> }): Promise<Metadata> {
  const product = productBySlug((await params).product);
  if (!product) return {};
  return { title: product.name, description: product.lede };
}

export default async function ProductPage({ params }: { params: Promise<{ product: string }> }) {
  const product = productBySlug((await params).product);
  if (!product) notFound();
  return (
    <main id="main">
      <ProductHero product={product} />
      <ProductWalkthrough product={product} />
      <InAction product={product} />
      <Specs product={product} />
      <CloseTheLoop product={product} />
      <ContactFooter />
    </main>
  );
}
