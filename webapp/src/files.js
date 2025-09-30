const ShowcaseFiles = ({ files }) => {

  const filenameTruncate = (filename) => {
    if (filename.length <= 20) return filename;

    const extIndex = filename.lastIndexOf('.');
    if (!extIndex) return filename.slice(0, 18) + '...';

    const name = filename.slice(0, extIndex);
    const ext = filename.slice(extIndex);

    const charsToShow = 20 - ext.length - 3;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);

    return name.slice(0, frontChars) + '...' + name.slice(name.length - backChars) + ext;
  };

  const fileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = bytes / Math.pow(k, i);
    return `${size.toFixed(1)} ${sizes[i]}`;
  };

  return (
    <>
      {files.files.map((file, index) => {
        if (file.type.startsWith('image/')) {
            const encodedURL = encodeURI(file.URL)
          return (
            <div
              key={index}
              style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', maxWidth: '280px' }}
            >
              <img
                src={encodedURL}
                alt={file.name}
                style={{ width: '100px', height: 'auto', borderRadius: '4%', marginRight: '20px' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h4>{filenameTruncate(file.name)}</h4>
                <h5>{fileSize(file.size)}</h5>
              </div>
            </div>
          );
        } else if (file.type.startsWith('video/')) {
          return (
            <div key={index}>
              <video src={file.URL} width="180" height="160" controls style={{ borderRadius: '0', marginBottom: '10px' }} />
              <h5>{file.name}</h5>
            </div>
          );
        } else if (file.type === 'application/pdf') {
          return (
            <div key={index}>
              <img
                src="webapp/src/img/pdf-icon.png"
                alt="PDF"
                style={{ width: '80px', height: '70px' }}
              />
              <h5>{file.name}</h5>
            </div>
          );
        } else {
          return (
            <div key={index}>
              <a href={file.URL} target="_blank" rel="noopener noreferrer">
                {filenameTruncate(file.name)}
              </a>
              <h5>{fileSize(file.size)}</h5>
            </div>
          );
        }
      })}
      {files.comment && (
        <div style={{ marginTop: '10px' }}>
          <h4 style={{ whiteSpace: 'pre-line' }}>{files.comment.match(/.{1,50}/g).join('\n')}</h4>
        </div>
      )}
    </>
  );
};

export default ShowcaseFiles