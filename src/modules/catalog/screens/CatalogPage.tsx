import CatalogBrowser from '@/modules/catalog/screens/CatalogBrowser';
import FeaturedCatalog from '@/modules/catalog/screens/FeaturedCatalog';

export default function CatalogPage({
  featured = false,
}: {
  featured?: boolean;
}) {
  return featured ? <FeaturedCatalog /> : <CatalogBrowser />;
}
