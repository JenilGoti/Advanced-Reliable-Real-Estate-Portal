const link = window.location.href;
const shareData = {
    title: 'NESTSCOUT',
    text: "User Profile from NESTSCOUT\n",
    url: link,
}

share = () => {
    navigator.share(shareData);
}