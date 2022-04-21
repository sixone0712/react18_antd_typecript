export const downloadFileUrl = (url: string): void => {
  // file-saver는 대용량 파일을 다운로드 할 수는 없다.
  // StreamSaver로는 대용량 파일을 다운로드 할 수 있지만, 관련 해서 인터넷에서 자바스크립트 파일을 다운로드 해야 해서 사용 불가능
  // 또한, service worker를 사용해야 하지만, http는 불가능
  // 따라서, 브라우져에서 직접 다운로드 하는 것으로 함.
  // 다행이 요청 시, 쿠기가 포함되어서 요청되어지는 것으로 보임.

  try {
    const downloadIframe: HTMLIFrameElement = document.getElementById('download-iframe') as HTMLIFrameElement;

    if (downloadIframe.contentWindow) {
      const link = document.createElement('a');
      downloadIframe.contentWindow.document.body.appendChild(link);
      link.href = `http://${window.location.host}${url}`;
      link.style.display = 'none';
      link.click();
      link.remove();
    } else {
      throw new Error();
    }
  } catch (e) {
    throw new Error();
  }

  // const link = document.createElement('a');
  // document.body.appendChild(link);
  // link.href = `http://${window.location.host}${url}`;
  // link.style.display = 'none';
  // link.target = '_blank';
  // link.click();
  // link.remove();
};
