// import '../style/GoToTopButton.css'
// import { FaArrowUp } from "react-icons/fa";

// const GoToTopButton = () => {
  
//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth'
//     });
//   };

//   return (
//     <button onClick={scrollToTop} className='go-to-top-button'><FaArrowUp/></button>
//   );
// };

// export default GoToTopButton;


import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
