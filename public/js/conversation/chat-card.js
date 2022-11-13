const chatCard = (text, timeStamp, sender, marker) => {
    const chat = `
                    <div class="chat">` + text + `
                    </div>
                    <div class="chat-footer">
                        <span class="time-stamp">` + formatAMPM(timeStamp) + `</span>
                        &emsp;` + (!sender ? `
                        <span style="font-size: inherit;" class="material-symbols-outlined ` + (marker ? 'active' : '') + `">
                            done_all
                        </span>` : ``) + `
                    </div>
    `;
    const div = document.createElement('div');
    div.classList.add('chat-box')
    div.classList.add(sender ? 'sended' : 'recived');
    div.innerHTML = chat;
    return div;
}

function formatAMPM(date) {
    date = new Date(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}