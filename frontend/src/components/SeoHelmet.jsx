import React from 'react'
import {Helmet} from "react-helmet";

const SeoHelmet = ({title, description}) => {
  return (
    <Helmet>
      <meta charSet="UTF-8" />
      <meta name="keywords" content="HTML, CSS, JavaScript" />
      <meta name="author" content="Coder Anil" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description"content={description}/>
      <title>{title}</title>
    </Helmet>
  )
}

export default SeoHelmet;

// Craft unique, descriptive, and keyword-rich descriptions for each product. Avoid using manufacturer descriptions to prevent duplicate content issues