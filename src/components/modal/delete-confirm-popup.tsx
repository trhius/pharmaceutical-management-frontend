// import PropTypes from "prop-types"
// import { useTranslation } from "react-i18next";

// import ConfirmPopup from "./confirm-popup";

// const DeleteConfirmPopup = ({ object, plural, popupOpen, setPopupOpen, handleCancel, handleConfirm, specialMessage }) => {
//   const {t} = useTranslation('table', {keyPrefix: 'delete-confirm-pu'});

//   const message = specialMessage || `${t('pre-message')} ${plural ? t('plural-prep') :  t('single-prep')} ${object || (plural ? t('records') : t('record'))} ${t('post-message')}`;
//   return (
//     <ConfirmPopup
//       content={{
//         title: t('title'),
//         message,
//         cancelBtnText: t('cancel-btn-text'),
//         confirmBtnText: t('confirm-btn-text')
//       }}
//       popupOpen={popupOpen}
//       setPopupOpen={setPopupOpen}
//       handleCancel={handleCancel}
//       handleConfirm={handleConfirm}
//     />
//   )
// };

// DeleteConfirmPopup.propTypes = {
//   object: PropTypes.string,
//   plural: PropTypes.bool,
//   popupOpen: PropTypes.bool,
//   setPopupOpen: PropTypes.func,
//   handleCancel: PropTypes.func,
//   handleConfirm: PropTypes.func,
//   specialMessage: PropTypes.string,
// }

// export default DeleteConfirmPopup;