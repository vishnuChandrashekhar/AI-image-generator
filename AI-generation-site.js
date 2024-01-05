const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";
const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".image-card")[index];
    const imgElement = imgCard.querySelector("img");

    
    //Set the image source to the AI-generated Image data
    const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImg;


      //When the image is loaded, remove the loading class
      imgElement.onload = () => {
          imgCard.classList.remove("loading"); 
    }

  })

}
const generateAiImages = async (userPromt, userImageQuantity) => {

  try{
    // Send a request to the OpenAi API to generate images based on user imputs
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: userPromt,
        n: parseInt(userImageQuantity),
        size: "512x512",
        response_format: "b64_json"
      })
    });

    if (!response.ok) throw new Error("Failed to generate images! Please Try again")

    const { data } = await response.json(); // Get data from the response
    
    updateImageCard([...data]);

  } catch (error){
    console.log(error);
  }
  
}

//https://platform.openai.com/docs/api-reference/images/create ---025.31
const handleformsubmission = (e) => {  e.preventDefault(); 
  //e.stopPropagation(); Using this You can try stopping the event propagation by adding in your event handler

  // console.log(e.target);

  //Get user input and image quantity values form the form.
  const userPromt = e.target.querySelector('.prompt-input').value;
  const userImageQuantity = e.target.querySelector('.img-quantity').value;
  console.log(userPromt, userImageQuantity); //This Code ensures better compatibility and makes the code more readable and maintainable.

  /*const userPromt = e.target[0].value;
    const userImageQuantity = e.target[1].value;
    console.log(userPromt, userImageQuantity); --- You can Use this code for above as well*/


//Creating HTML markup for Image cards with loading state. This is a common technique in web development for dynamically updating the content of a part of a webpage based on user actions, input, or other dynamic factors.
  const imgCardMarkup = Array.from({length: userImageQuantity}, () =>

    `<div class="image-card loading">
      <img src="images/loader.svg" alt="image">
      <a href="#" class="download-btn">
        <img src="images/download.svg" alt="download icon">
      </a>
    </div>`
  ).join("");

  imageGallery.innerHTML = imgCardMarkup;

  generateAiImages(userPromt, userImageQuantity);
  
}

generateForm.addEventListener('submit', handleformsubmission);
 // handleformsubmission: This is the callback function that will be executed when the "submit" event occurs. This function should be defined elsewhere in your code.

