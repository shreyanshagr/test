const form_html = `<section class="form-section">
<form action="">
  <h3 id="title">Signup for the waitlist</h3>
  <div class="input_box">
    <label for="">Email</label>
    <input
      id="email"
      name="gmail"
      type="email"
      placeholder="example@domain.com"
    />
  </div>
  <button type="submit" class="submit_btn" id="formBtn">Sign up</button>
  <p class="footer" id="footer">
    Signed up before? &nbsp;
    <span class="pointer" id="footerAction"
      ><strong> Check your status</strong>
    </span>
  </p>
</form>

<div class="form_stats hidden-box">
  <h3>Successfully signed up for Waitlist</h3>
  <div class="stats_box">
    <div class="box">
      <p>Your Position</p>
      <h3 id="position">514</h3>
    </div>
    <div class="box">
      <p>People on Waitlist</p>
      <h3 id="total">514</h3>
    </div>
  </div>
  <div class="box">
    <p>Referral Link</p>
    <h3 id="referral">https://companyname.com?ref_id=1234</h3>
  </div>
  <p>Share and refer your friends to move up the line!</p>
  <div class="btn_container">
    <button class="submit_btn">Twitter</button>
    <button class="submit_btn">Whatsapp</button>
  </div>
</div>
</section>`;

const formHolder = document.getElementById("embeded-waitlist");
formHolder.innerHTML = form_html;
const form = document.querySelector(".form-section form");
const stats = document.querySelector(".form_stats");

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const listId = params.waitlistid || formHolder.getAttribute("data-waitlist_id"); // waitlist id
const refId = params.ref_id; // user id of reffer
const ref_email = params.email;
console.log(ref_email);
let total;
let flag = true;

async function getStatus(data) {
  document
    .querySelector(".form-section form .submit_btn")
    .classList.add("disable");
  document.querySelector(".form-section form .submit_btn").textContent =
    "Loading...";
  document
    .querySelector(".form-section form .submit_btn")
    .setAttribute("disabled", true);
  // adding user to list
  const rawres = await fetch(
    "https://us-central1-developerpass-co.cloudfunctions.net/apiendpoint/check-status",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const res = await rawres.json();
  console.log(res);
  const userData = res.data;
  console.log(userData);
  total = userData.total_waiters;
  form.classList.add("hidden-box");
  stats.classList.remove("hidden-box");
  document.querySelector("#total").textContent = total;
  document.querySelector("#position").textContent = userData.waiting_postion;
  document.querySelector("#referral").textContent = userData.reffreal_link;
}

async function postData(data) {
  console.log(data);
  document
    .querySelector(".form-section form .submit_btn")
    .classList.add("disable");
  document.querySelector(".form-section form .submit_btn").textContent =
    "Loading...";
  document
    .querySelector(".form-section form .submit_btn")
    .setAttribute("disabled", true);
  // adding user to list
  const rawres = await fetch(
    "https://us-central1-developerpass-co.cloudfunctions.net/apiendpoint/subscribe-site",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const res = await rawres.json();
  const userData = res.data;
  console.log(userData);
  total = userData.total_waiters;
  form.classList.add("hidden-box");
  stats.classList.remove("hidden-box");
  document.querySelector("#total").textContent = total;
  document.querySelector("#position").textContent = userData.waiting_position;
  document.querySelector("#referral").textContent = userData.reffreal_link;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const isReferred = ref_email ? true : false;
  const data = {
    email,
    isReferred,
    waitlist_id: listId,
    Refferar_email_id: ref_email,
  };
  flag ? postData(data) : getStatus(data);
});

function statusForm() {
  const title = document.querySelector("#title");
  const formBtn = document.querySelector("#formBtn");
  const footer = document.querySelector("#footer");
  flag = !flag;
  const titleText = flag
    ? "Signup for the waitlist"
    : "Get your waiting status";
  const btnText = flag ? "Sign up" : "Check Status";
  const footerHtml = flag
    ? `Signed up before? &nbsp;
  <span class="pointer" id="footerAction"
    ><strong> Check your status</strong>
  </span>`
    : `Haven't signedup yet? &nbsp;
  <span class="pointer" id="footerAction"
    ><strong>Signup</strong>
  </span>`;
  title.textContent = titleText;
  formBtn.textContent = btnText;
  footer.innerHTML = footerHtml;
  document.querySelector("#footerAction").addEventListener("click", statusForm);
}

document.querySelector("#footerAction").addEventListener("click", statusForm);
