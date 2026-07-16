export interface ModalAlertProps {
  showModal: boolean;
  titleBig?: string;
  title?: string;
  isCustom?: boolean;
  leftFunction?: () => void;
  rightFunction?: () => void;
  additionalFunction?: () => void;
  leftText?: string;
  rightText?: string;
  additionalText?: string;
  iconImage?: string | any;
  withIcon?: boolean;
  withTime?: boolean;
  time?: number;
  listWorstText?: string[];
  withTextInput?: boolean;
  valueTextInput?: string;
  onChangeTextInput?: (text: string) => void;
  titleBigJapan?: string;
  subtitle?: string;
  imageSize?: number;
  buttonRightDisabled?: boolean;
  withDeletedAccount?: boolean;
}
