```js
const DEMO_KEY = "mizari_demo_state_v1";

function demoState() {
  try {
    return JSON.parse(
      localStorage.getItem(DEMO_KEY) || "null"
    ) || {
      users: 1,
      rides: [],
      nextRide: 1,
      driver: {
        online: false,
        verified: false
      },
      complaints: [],
      earnings: 0
    };
  } catch {
    return {
      users: 1,
      rides: [],
      nextRide: 1,
      driver: {
        online: false,
        verified: false
      },
      complaints: [],
      earnings: 0
    };
  }
}

function saveDemo(state) {
  localStorage.setItem(
    DEMO_KEY,
    JSON.stringify(state)
  );
}

function demoUser() {
  const role =
    window.MIZARI_ROLE || "passenger";

  return {
    id: 1,
    role: role,
    phone:
      localStorage.getItem(
        "mizari_demo_phone"
      ) || "0700000000",
    name:
      role === "admin"
        ? "مدیر میزاری"
        : role === "driver"
          ? "راننده آزمایشی"
          : "مسافر آزمایشی"
  };
}


/* =========================
   DEMO API
========================= */

async function demoCall(path, opt = {}) {

  const state = demoState();

  const method =
    (opt.method || "GET").toUpperCase();

  let body = {};

  try {
    body = opt.body
      ? JSON.parse(opt.body)
      : {};
  } catch {
    body = {};
  }


  /* کاربر */
  if (path === "/me") {
    return {
      user: demoUser()
    };
  }


  /* =========================
     سفرها
  ========================= */

  if (
    path === "/rides" &&
    method === "GET"
  ) {
    return {
      rides: state.rides
    };
  }


  /* ایجاد سفر */
  if (
    path === "/rides" &&
    method === "POST"
  ) {

    const distance =
      Number(body.distanceKm || 5);

    const ride = {

      id: state.nextRide++,

      origin_text:
        body.originText ||
        "مبدا آزمایشی",

      destination_text:
        body.destinationText ||
        "مقصد آزمایشی",

      distance_km:
        distance,

      duration_min:
        Number(
          body.durationMin || 15
        ),

      fare:
        Math.round(
          50 + distance * 20
        ),

      payment_method:
        body.paymentMethod ||
        "cash",

      status:
        "searching",

      created_at:
        new Date().toISOString()
    };

    state.rides.unshift(ride);

    saveDemo(state);

    return {
      ride
    };
  }


  /* مشاهده سفر */
  const rideMatch =
    path.match(
      /^\/rides\/(\d+)$/
    );

  if (
    rideMatch &&
    method === "GET"
  ) {

    const ride =
      state.rides.find(
        x =>
          x.id ==
          rideMatch[1]
      );

    return {
      ride:
        ride || null
    };
  }


  /* =========================
     قبول سفر
  ========================= */

  const acceptMatch =
    path.match(
      /^\/rides\/(\d+)\/accept$/
    );

  if (
    acceptMatch &&
    method === "POST"
  ) {

    if (
      !state.driver.verified
    ) {
      throw new Error(
        "راننده هنوز توسط مدیریت تأیید نشده است"
      );
    }

    const ride =
      state.rides.find(
        x =>
          x.id ==
          acceptMatch[1]
      );

    if (!ride) {
      throw new Error(
        "سفر پیدا نشد"
      );
    }

    ride.status =
      "driver_assigned";

    ride.driver_id = 1;

    saveDemo(state);

    return {
      ride
    };
  }


  /* =========================
     وضعیت سفر
  ========================= */

  const statusMatch =
    path.match(
      /^\/rides\/(\d+)\/status$/
    );

  if (
    statusMatch &&
    method === "POST"
  ) {

    const ride =
      state.rides.find(
        x =>
          x.id ==
          statusMatch[1]
      );

    if (!ride) {
      throw new Error(
        "سفر پیدا نشد"
      );
    }

    ride.status =
      body.status ||
      ride.status;


    if (
      ride.status ===
        "completed" &&
      !ride._paid
    ) {

      state.earnings +=
        Number(
          ride.fare || 0
        );

      ride._paid = true;
    }

    saveDemo(state);

    return {
      ride
    };
  }


  /* =========================
     وضعیت راننده
  ========================= */

  if (
    path === "/drivers/status" &&
    method === "POST"
  ) {

    if (
      !state.driver.verified
    ) {
      throw new Error(
        "راننده هنوز تأیید نشده است"
      );
    }

    state.driver.online =
      !!body.online;

    saveDemo(state);

    return {
      driver:
        state.driver
    };
  }


  /* درآمد */
  if (
    path === "/drivers/earnings"
  ) {
    return {
      earnings:
        state.earnings
    };
  }


  /* =========================
     مدیریت
  ========================= */

  if (
    path === "/admin/stats"
  ) {

    return {

      users:
        state.users || 1,

      drivers:
        1,

      onlineDrivers:
        state.driver.online
          ? 1
          : 0,

      rides:
        state.rides.length,

      activeRides:
        state.rides.filter(
          r =>
            r.status !==
            "completed"
        ).length,

      complaints:
        state.complaints.length
    };
  }


  /* لیست رانندگان */
  if (
    path === "/admin/drivers"
  ) {

    return {

      drivers: [

        {
          id: 1,

          phone:
            "0700000000",

          vehicle_model:
            "هوندا CG 125",

          plate:
            "DEMO-001",

          verified:
            !!state.driver.verified
        }

      ]

    };
  }


  /* شکایت‌ها */
  if (
    path === "/admin/complaints"
  ) {

    return {
      complaints:
        state.complaints
    };
  }


  /* =========================
     تأیید راننده
  ========================= */

  const verifyMatch =
    path.match(
      /^\/drivers\/verify\/(\d+)$/
    );

  if (
    verifyMatch &&
    method === "POST"
  ) {

    state.driver.verified =
      true;

    saveDemo(state);

    return {

      ok: true,

      driver: {

        id:
          Number(
            verifyMatch[1]
          ),

        verified:
          true

      }

    };
  }


  /* =========================
     شکایت
  ========================= */

  if (
    path === "/complaints" &&
    method === "POST"
  ) {

    state.complaints.unshift({

      id:
        state.complaints.length +
        1,

      category:
        body.category ||
        "support",

      message:
        body.message ||
        ""

    });

    saveDemo(state);

    return {
      ok: true
    };
  }


  return {};
}


/* =========================
   API
========================= */

const API = {

  token() {

    return localStorage.getItem(
      "mizari_token"
    );

  },


  async call(
    path,
    opt = {}
  ) {

    const apiUrl =
      window.MIZARI_API;


    /*
      وقتی localhost است،
      از Demo استفاده می‌کنیم.
    */

    if (
      !apiUrl ||
      apiUrl.includes(
        "localhost"
      )
    ) {

      return demoCall(
        path,
        opt
      );

    }


    const headers = {

      "Content-Type":
        "application/json",

      ...(opt.headers || {})

    };


    const token =
      this.token();


    if (token) {

      headers.Authorization =
        "Bearer " + token;

    }


    const response =
      await fetch(
        apiUrl + path,
        {
          ...opt,
          headers
        }
      );


    const data =
      await response
        .json()
        .catch(
          () => ({})
        );


    if (!response.ok) {

      throw new Error(
        data.error ||
        "خطای سرور"
      );

    }


    return data;

  },


  /* =========================
     OTP
  ========================= */

  async otp(phone) {

    if (
      !window.MIZARI_API ||
      window.MIZARI_API.includes(
        "localhost"
      )
    ) {

      localStorage.setItem(
        "mizari_demo_phone",
        phone
      );

      return {
        demoCode:
          "123456"
      };

    }


    return this.call(
      "/auth/request-otp",
      {
        method:
          "POST",

        body:
          JSON.stringify({
            phone
          })
      }
    );

  },


  /* =========================
     Verify OTP
  ========================= */

  async verify(
    phone,
    code
  ) {

    if (
      !window.MIZARI_API ||
      window.MIZARI_API.includes(
        "localhost"
      )
    ) {

      if (
        code !==
        "123456"
      ) {

        throw new Error(
          "کد آزمایشی صحیح: 123456"
        );

      }


      localStorage.setItem(
        "mizari_demo_phone",
        phone
      );


      localStorage.setItem(
        "mizari_token",
        "demo-token"
      );


      return {

        token:
          "demo-token",

        user:
          demoUser()

      };

    }


    return this.call(
      "/auth/verify-otp",
      {

        method:
          "POST",

        body:
          JSON.stringify({

            phone,
            code

          })

      }
    );

  },


  /* کاربر */
  me() {

    return this.call(
      "/me"
    );

  },


  /* سفرها */
  rides() {

    return this.call(
      "/rides"
    );

  }

};
```
