export const ARTICLES_QUERY = `*[_type == "article" && !coalesce(hidden, false)] | order(date desc) {
  title,
  "slug": slug.current,
  description,
  date,
  tags,
  hidden,
  chinese
}`

export const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  description,
  date,
  tags,
  hidden,
  chinese,
  body
}`

export const ARTICLE_SLUGS_QUERY = `*[_type == "article" && !coalesce(hidden, false)]{
  "slug": slug.current
}`