import { Audio } from  'react-loader-spinner'
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export const Loader = () => {
    return(
<Audio
    height = "80"
    width = "80"
    radius = "9"
    color = 'green'
    ariaLabel = 'Loading'     
  />
  )
}