import { useEffect, useRef } from "react"
import { FilesetResolver,HandLandmarker,HandLandmarkerResult}   from "@mediapipe/tasks-vision"

type handProps={
    sethandresults:(result:any)=>void
}

 let detectionInterval:any;
export const HandReco=({sethandresults}:handProps)=>{
   const vedioRef=useRef<HTMLVideoElement>(null);
   useEffect(()=>{
    initVedioandModel();

    return ()=>{
        clearInterval(detectionInterval)
    }
   },[])

    const initVedioandModel=async()=>{
         sethandresults({isLoading:true})

         const vedioelemnt=vedioRef.current
         if(!vedioelemnt){
            return 
         }

         await initvedio(vedioelemnt)

         const handLandmarker=await initModel();
         detectionInterval=setInterval(()=>{
            const detections=handLandmarker.detectForVideo(vedioelemnt,Date.now())
               processdetection(detections,sethandresults) 
        },1000/30)
             sethandresults({isLoading:false})
    }

     return (
        <div>
            <video className="border-stone-800 rounded-lg border-2 -scale-x-1" ref={vedioRef}></video>
        </div>
     )

}

async function initvedio(vedioelemnt:HTMLVideoElement){
    const stream=await navigator.mediaDevices.getUserMedia({
        video:true
    })

    vedioelemnt.srcObject=stream
    vedioelemnt.addEventListener("loadeddata",()=>{
        vedioelemnt.play()
    })
}  

async function initModel() {
    const api = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
    const handLandmarker = HandLandmarker.createFromOptions(api, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: 'GPU'
        },
        numHands: 2,
        runningMode: 'VIDEO'
    });
    return handLandmarker
}

async function processdetection (detections:HandLandmarkerResult,sethandresults:(result:any)=>void){
    if(detections && detections.handedness.length >1){
         const rightIndex = detections.handedness[0][0].categoryName === 'Right' ? 0 : 1;
        const leftIndex = rightIndex === 0 ? 1 : 0;

        const { x: leftX, y: leftY, z: leftZ } = detections.landmarks[leftIndex][6];
        const { x: rightX, y: rightY, z: rightZ } = detections.landmarks[rightIndex][6];

        const tilt = (rightY - leftY) / (rightX - leftX);
        const degrees = (Math.atan(tilt) * 180) / Math.PI;

        sethandresults({
            isDetected: true,
            tilt,
            degrees
        })
    }else{
        sethandresults({
            isDetected:false,
            tilt:0,
            degrees:0
        })
    }
}
