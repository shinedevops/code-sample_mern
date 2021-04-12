import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from "sweetalert";
export const successAlert = alertMessage => {
    toast.success(alertMessage, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        closeOnClick: true
    });
};

export const errorAlert = alertMessage => {
    toast.error(alertMessage, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        closeOnClick: true
    });
};




//===========================================
//.. Debugging Alerts For Api Loading 
//===========================================
export const APIAlert = (msg) => ({

	success: () => {
		// toast.success(msg, {
		// 	position: toast.POSITION.BOTTOM_RIGHT,
		// 	autoClose: 1500,
		// 	hideProgressBar: true,
		// 	closeOnClick: false,
		// 	pauseOnHover: false,
		// 	draggable: false,
		// })
	},
	error: () => { 
		// toast.error(msg, {
		// position: toast.POSITION.BOTTOM_RIGHT,
		// hideProgressBar: false,
		// closeOnClick: true,
		// pauseOnHover: true,
		// draggable: false,
		// })
	}
});

//===========================================

export const responseMessage = (type, message, buttons) => {

	switch (type.toLowerCase()) {
		case 'success':
			swal({
				title: "Success!",
				text: message,
				icon: "success",
				timer: 2000,
				button: false
			})
			break;

		case 'error':
			swal({
				title: "Error!",
				text: message,
				icon: "error",
				timer: 2000,
				button: false
			})
			break;

		case 'warning':
		case 'warn':
			swal({
				title: "Warning!",
				text: message,
				icon: "warning",
				timer: 2000,
				button: false
			})
			break;

		default:
		// none
	}
}