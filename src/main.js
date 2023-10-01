import '../styles/modern-normalize.css';
import '../styles/style.css';
import '../styles/components/header.css';
import '../styles/components/footer.css';
import '../styles/components/hero.css'
import '../styles/components/about.css'
import '../styles/components/craftmanship.css'
import '../styles/components/project.css'
import '../styles/components/mobile-nav.css'
import '../styles/utils.css';

import { blurImage } from "./utils/image-utils.js";
import  { toggleMobileNav } from "./utils/mobile-nav.js";
import { toggleTheme } from './utils/theme-toggle.js';

blurImage();
toggleMobileNav();
toggleTheme();