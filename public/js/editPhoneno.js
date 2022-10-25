const sendOtpBtn = document.querySelector('.send-otp');
const verifyBtn = document.querySelector('.verify-no');
const number = document.querySelector('#phone_no');
const OTP = document.querySelector('.OTP');
const otpVal = document.querySelector('#OTP');
const host = location.protocol + '//' + location.host;

function sendOtp() {
    const moblieNo = parseInt(number.value);
    console.log(moblieNo);
    const isValid = (moblieNo > 1000000000 && moblieNo < 10000000000);
    console.log(isValid);
    if (isValid) {
        fetch(host + '/send-otp', {
                method: 'POST',
                body: new URLSearchParams("new_number=" + moblieNo),
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.statusCode == 200) {
                    verifyBtn.style.display = "inline";
                    OTP.style.display = "block";
                    sendOtpBtn.innerHTML = "Resend OTP"

                } else {
                    number.insertAdjacentHTML("afterend", "<span class='error-message'>" + data.message + "</span>");
                }
                console.log(data);
            })
            .catch(err => {
                console.log(err);
                number.insertAdjacentHTML("afterend", "<span class='error-message'>*otp request faild due to some issue</span>");
            })
    } else {
        number.classList.add("error-input");
        number.insertAdjacentHTML("afterend", "<span class='error-message'>*invalid mobile no</span>");
    }

}

function verifyOtp() {
    const otp = parseInt(otpVal.value)
    fetch(host + '/verify-otp', {
            method: 'POST',
            body: new URLSearchParams("OTP=" + otp),
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.statusCode == 200) {

                window.location.assign(host + "/verify-succesfullscreen");
            }
            if (data.statusCode == 400) {
                OTP.insertAdjacentHTML("afterend", "<span class='error-message'>*" + data.message + "</span>");
            }
            console.log(data);
        })
        .catch(err => {
            OTP.insertAdjacentHTML("afterend", "<span class='error-message'>*Wrong otp</span>");
        })
}

sendOtpBtn.addEventListener("click", sendOtp);
verifyBtn.addEventListener("click", verifyOtp);