import service from '../index';


const bookingRecordApi = {
    fetchBookingRecord(userId) {
        return service({
            url: `/booking-record/${userId}`,
            method: 'get'
        })
    }
}

export const fetchBookingRecord = bookingRecordApi.fetchBookingRecord