'use strict';

let customRatio = true;

// aspect       0      1      2      3       4
let ratios = ['0:0', '4:3', '16:9', '1:1', '1:2'];
let aspect = 2;

let ratio = getAspectRatio();

/**
 * Get aspect ratio
 * @returns {integer} aspect ratio
 */
function getAspectRatio() {
    customRatio = aspect == 0 ? true : false;
    let ratio = ratios[aspect].split(':');
    return ratio[1] / ratio[0];
}

/**
 * Set aspect ratio
 * @param {integer} index ratios index
 */
function setAspectRatio(index) {
    aspect = index;
    ratio = getAspectRatio();
    resizeVideoMedia();
}

/**
 * Calculate area
 * @param {integer} Increment
 * @param {integer} Count
 * @param {integer} Width
 * @param {integer} Height
 * @param {integer} Margin
 * @returns
 */
function Area(Increment, Count, Width, Height, Margin = 10) {
    ratio = customRatio ? 0.75 : ratio;
    let i = 0;
    let w = 0;
    let h = Increment * ratio + Margin * 2;
    while (i < Count) {
        if (w + Increment > Width) {
            w = 0;
            h = h + Increment * ratio + Margin * 2;
        }
        w = w + Increment + Margin * 2;
        i++;
    }
    if (h > Height) return false;
    else return Increment;
}

/**
 * Resize video elements
 */
function resizeVideoMedia() {
    let Margin = 5;
    let videoMediaContainer = getId('videoMediaContainer');
    let Width = videoMediaContainer.offsetWidth - Margin * 2;
    let Height = videoMediaContainer.offsetHeight - Margin * 2;
    let Cameras = getEcN('Camera');
    let max = 0;

    let bigWidth = Width * 4;
    if (videoMediaContainer.childElementCount == 1) {
        Width = Width - bigWidth;
    }

    // loop (i recommend you optimize this)
    let i = 1;
    while (i < 5000) {
        let w = Area(i, Cameras.length, Width, Height, Margin);
        if (w === false) {
            max = i - 1;
            break;
        }
        i++;
    }

    max = max - Margin * 2;
    setWidth(videoMediaContainer, Cameras, max, bigWidth, Margin, Height);
    document.documentElement.style.setProperty('--vmi-wh', max / 3 + 'px');
}

/**
 * Set Width
 * @param {object} videoMediaContainer
 * @param {object} Cameras
 * @param {integer} width
 * @param {integer} bigWidth
 * @param {integer} margin
 * @param {integer} maxHeight
 */
function setWidth(videoMediaContainer, Cameras, width, bigWidth, margin, maxHeight) {
    ratio = customRatio ? 0.68 : ratio;
    let isOneVideoElement = videoMediaContainer.childElementCount == 1 ? true : false;
    for (let s = 0; s < Cameras.length; s++) {
        let fromLeft = s * 8;
        //Cameras[s].style.width = 100 + 'px';
        //Cameras[s].style.margin = margin + 'px';
        //Cameras[s].style.height = 100 + 'px';
        Cameras[s].style.borderradius = 500 + 'px';
        Cameras[s].style.left = 30 + fromLeft + '%';
        if (isOneVideoElement) {
            //Cameras[s].style.width = 100 + 'px';
            //Cameras[s].style.height = 100 + 'px';
            Cameras[s].style.borderradius = 500 + 'px';
            //let camHeigh = Cameras[s].style.height.substring(0, Cameras[s].style.height.length - 2);
            //if (camHeigh >= maxHeight) Cameras[s].style.height = maxHeight - 2 + 'px';
        }
    }
}

/**
 * Handle window event listener
 */
window.addEventListener(
    'load',
    function (event) {
        function zoom(event) {
              event.preventDefault();
              
              scale += event.deltaY * -0.009;
            
              // Restrict scale
              scale = Math.min(Math.max(1, scale), 2.2);
            
              // Apply scale transform
                el.style.transform = `scale(${scale})`;
              
            }
            
            let scale = 1;
            const el = document.querySelector('body');
            //const el = document.getElementById('videoMediaContainer');
            document.body.onwheel = zoom;

        resizeVideoMedia();
        window.onresize = resizeVideoMedia;
    },
    false,
);
