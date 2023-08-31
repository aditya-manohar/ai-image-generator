const api = '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'

const maxImages = 9; 

const loading = document.getElementById('loading');

var txt = 'Convert Your Text to Images ...';
var speed = 90;
var i = 0;
const heading = document.getElementById('heading');

let selectedImageNumber = null;

function typing()
{

    console.log('loaded');
    if(i<txt.length)
    {
        document.getElementById('heading').innerHTML += txt.charAt(i);
        i++;
        setTimeout(typing,speed);
    }
}

function getRandomNumber(min,max)
{
    return Math.floor(Math.random() * (max-min + 1) + min);
}

function disableBtn()
{
    document.getElementById('generate').disabled = true;
}

function enableBtn()
{
    document.getElementById('generate').disabled = false;
}

function clrImageGrid()
{
    const imagegrid = document.getElementById('image-grid');
    imagegrid.innerHTML = "";
}

async function generateImages(input)
{
    disableBtn();
    clrImageGrid();
    console.log(maxImages);

    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    const imageurls = [];

    for(let i=0;i<maxImages;i++)
    {
        const randomNumber = getRandomNumber(1,10000);
        const prompt  = `${input} ${randomNumber}`;
        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${api}`,
                },
                body : JSON.stringify({inputs : prompt})
            }
        );

        if(!response.ok)
        {
            alert("Failed to generate image !");
        }

        const blob = await response.blob();
        const imageurl = URL.createObjectURL(blob);
        imageurls.push(imageurl);

        const img = document.createElement("img");
        img.id = "img"
        img.src = imageurl;
        img.alt = `art-${i+1}`;
        img.onclick =()=> download(imageurl,i);api
        document.getElementById("image-grid").appendChild(img);
        
    }

    loading.style.display = "none";
    enableBtn();

    selectedImageNumber = null;
}

document.getElementById("generate").addEventListener('click',()=>{
    const input = document.getElementById("user-prompt").value;
    if(input.length < 6)
    {
        alert("Enter proper description")
    }
    else{
    generateImages(input);
    }
});

function downloadImage(imageurl,imageNumber)
{
    const link = document.createElement("a");
    link.href = imageurl;

    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}