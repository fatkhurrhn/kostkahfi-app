// src/services/whatsappService.js
/**
 * Mengirim OTP via WhatsApp menggunakan Twilio REST API
 * @param {string} phoneNumber - Nomor telepon penerima (format: 0812345678 atau +62812345678)
 * @param {string} otp - Kode OTP yang akan dikirim
 * @returns {Promise<string>} Message SID dari Twilio
 * @throws {Error} Jika pengiriman gagal
 */
// src/services/whatsappService.js
export const sendOTPviaWhatsApp = async (phoneNumber, otp) => {
  try {
    // 1. Validasi input
    if (!phoneNumber || !otp) {
      throw new Error('Nomor telepon dan OTP harus diisi');
    }

    // 2. Format nomor telepon dengan lebih robust
    let formattedNumber;
    
    // Hilangkan semua karakter non-digit
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    
    // Handle berbagai format nomor
    if (cleanedNumber.startsWith('0')) {
      // Format lokal 0812 => +62812
      formattedNumber = `whatsapp:+62${cleanedNumber.substring(1)}`;
    } else if (cleanedNumber.startsWith('62')) {
      // Format +62 atau 62 => +62
      formattedNumber = `whatsapp:+${cleanedNumber}`;
    } else if (cleanedNumber.startsWith('8')) {
      // Format 812... => +62812...
      formattedNumber = `whatsapp:+62${cleanedNumber}`;
    } else {
      // Format internasional lainnya
      formattedNumber = `whatsapp:+${cleanedNumber}`;
    }

    // 3. Ambil credentials dari environment variables
    const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      throw new Error('Konfigurasi Twilio tidak lengkap');
    }

    // 4. Persiapkan body request
    const bodyParams = new URLSearchParams();
    bodyParams.append('Body', `[Kahfi App] Kode verifikasi Anda: ${otp}\n\nJangan berikan kode ini kepada siapapun.`);
    bodyParams.append('From', `whatsapp:${twilioPhoneNumber}`);
    bodyParams.append('To', formattedNumber);

    // 5. Kirim request ke Twilio API
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`
        },
        body: bodyParams
      }
    );

    // 6. Handle response
    const data = await response.json();

    if (!response.ok) {
      console.error('Detail Error Twilio:', {
        status: response.status,
        errorCode: data.code,
        errorMessage: data.message,
        moreInfo: data.more_info
      });
      
      let errorMessage = 'Gagal mengirim OTP';
      if (data.code === 21211) {
        errorMessage = 'Nomor telepon tidak valid';
      } else if (data.code === 21608) {
        errorMessage = 'Nomor WhatsApp belum terdaftar di Twilio';
      } else if (data.message) {
        errorMessage = data.message;
      }
      
      throw new Error(errorMessage);
    }

    return data.sid;
  } catch (error) {
    console.error('Error in sendOTPviaWhatsApp:', error);
    throw new Error(`Gagal mengirim OTP: ${error.message}`);
  }
};