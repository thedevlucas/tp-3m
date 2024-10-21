const steps = document.querySelectorAll(".stepper-item");

function setStep(currentStep) {
    steps.forEach(step => {step.classList.remove("active"); step.classList.remove("completed")});
    steps.forEach((step, index) => {
        
        if (index <= currentStep) 
        {
            step.classList.add("completed");
        }
        if (index == currentStep+1) 
        {
            step.classList.add("active");
        } 
    });
}