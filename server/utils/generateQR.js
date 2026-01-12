import QRCode from "qrcode";

export const generateQRCode = async (text) => {
    return await QRCode.toDataURL(text);
};
