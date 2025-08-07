import { useState, useEffect } from "react"

const ShowcaseFiles = ({files}) => {

    const [avgSize, setAvgSize] = useState({width:'20%', height:'20%'})
    const [imgDimensions, setImgDimensions] = useState({})

    

    const filenameTruncate = (filename) => {
        if(filename.length <= 20) return filename

        const extIndex = filename.lastIndexOf('.')
        if(!extIndex) return filename.slice(0, 18) + '...'

        const name = filename.slice(0, extIndex);
        const ext = filename.slice(extIndex);

        const charsToShow = 20 - ext.length - 3;
        const frontChars = Math.ceil(charsToShow / 2);
        const backChars = Math.floor(charsToShow / 2);

        return (
            name.slice(0, frontChars) + '...' + name.slice(name.length - backChars) + ext
        )
    }

    const fileSize = (bytes) => {
        if(bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        const size = bytes / Math.pow(k, i)
        return `${size.toFixed(1)} ${sizes[i]}`
    }

    useEffect(() => {
        let loaded = 0;
        const newDims = {}

        files.forEach((file, index) => {
            if(file.type.startsWith('image/')){
                const img = new Image();
                img.src = URL.createObjectURL(file)
                img.onload = () => {
                    newDims[index] = {
                        width: img.width * 0.1,
                        height: img.height * 0.1
                    }
                    loaded ++;


                    if(loaded === files.filter(f => f.type.startsWith('image/').length)){
                        setImgDimensions(newDims);

                        const allDims = Object.values(newDims)
                        const avgW = allDims.reduce((sum, d) => sum + d.width, 0) / allDims.length;
                        const avgH = allDims.reduce((sum, d) => sum + d.height, 0) / allDims.length;

                        setAvgSize({ width: avgW, height: avgH });
                    }
                }
            }
        })
    }, [files])

    console.log(typeof files);
    

    return (
        <>

        {files.map((file, index) => {
            if(file.type.startsWith('image/')){
                return (
                    <div key={index} style={{ display:'flex', alignItems:'center', marginBottom:'10px',
                    maxWidth:'280px'}}>
                        <img src={URL.createObjectURL(file)} alt={file.name}
                        style={{position:'relative', width: avgSize.width, height: avgSize.height, 
                        borderRadius:'4%', left:'10px'}} />
                        <div style={{display:'flex', flexDirection:'column', marginLeft:'20px', 
                        height:'100%'}}>
                            <h4 style={{position:'relative'}}>{filenameTruncate(file.name)}</h4>
                            <h5 style={{position:'relative', textAlign:'left'}}>{fileSize(file.size)}</h5>
                        </div>
                    </div>
                )
            } else if(file.type.startsWith('video/')){
                return (
                <div key={index}>
                    <video src={URL.createObjectURL(file)} width="180" height="160" controls
                    style={{borderRadius: '0', position:'relative', left:'10px'}}/>
                    <h5>{file.name}</h5>
                </div>
                )
            } else if(file.type.startsWith('application/pdf')){
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
            }
        })}

        </>
    )

}


export default ShowcaseFiles