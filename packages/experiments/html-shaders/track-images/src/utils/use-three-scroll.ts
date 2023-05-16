import { useWindowScroll } from 'react-use';
import { useBodyScrollHeight } from './use-body-scroll-height';

export const useThreeScroll = () => {
  const { x, y } = useWindowScroll();
  const scrollHeight = useBodyScrollHeight();

  return {
    x,
    y,
    scrollHeight
  }

}