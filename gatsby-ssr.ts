import "./src/styles/global.css"

const onRenderBody = ({ setHtmlAttributes }: any) => {
  setHtmlAttributes({ lang: `en` })
}

export { onRenderBody }
