import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import DrawerCustome from 'components/ui/DrawerCustome';

export const SideBar = (props) => {
  const { title, bodyClass, panelExpand, closePanel, direction, children } = props;

  return (
    <DrawerCustome
      title={
        title ? (
          title
        ) : (
          <div className="flex flex-row items-center gap-3 pt-8 pb-6 px-4">
            <MixerHorizontalIcon style={{ height: '24px', width: '24px' }} />
            <div className="text-center text-gray-800 text-[28px] font-normal font-opificio">Filter</div>
          </div>
        )
      }
      isOpen={panelExpand}
      onClose={closePanel}
      onRequestClose={closePanel}
      placement={direction === 'rtl' ? 'left' : 'right'}
      width={520}
      bodyClass={bodyClass}
    >
      {children}
    </DrawerCustome>
  );
};

export default SideBar;
