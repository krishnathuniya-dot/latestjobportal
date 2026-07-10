import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import "../css/categories.css";
import RecenthotsJob from "./Recenthotsjob";
import Footer from "./Footer";

const categories = [
  { name: "Design", count: 1 },
  { name: "Marketing", count: 2 },
  { name: "IT", count: 2 },
  { name: "Operations", count: 1 },
  { name: "Product Manager", count: 1 },
];

function Category() {
  return (
    <div className="job-portal">

      {/* Slider Start */}
      <div className="job-slider">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          loop={true}
        >

          {/* Full Stack Developer */}
          <SwiperSlide>
            <div className="slide slide1">
              <div className="slide-content">
                <h1>Become a Full Stack Developer</h1>
                <p>
                  Build the future with modern technologies
                </p>

                <button>Explore Jobs →</button>
              </div>

              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80"
                alt="Developer"
              />
            </div>
          </SwiperSlide>

          {/* Digital Marketing */}
          <SwiperSlide>
            <div className="slide slide2">
              <div className="slide-content">
                <h1>Digital Marketing Career</h1>

                <p>
                  Reach more customers and grow businesses.
                </p>

                <button>Explore Jobs →</button>
              </div>

              <img
                src="https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&q=80"
                alt="Marketing"
              />
            </div>
          </SwiperSlide>

          {/* UI UX Design */}
          <SwiperSlide>
            <div className="slide slide3">
              <div className="slide-content">
                <h1>Creative UI / UX Design</h1>

                <p>
                  Design beautiful user experiences.
                </p>

                <button>Explore Jobs →</button>
              </div>

              <img
                src="https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&q=80"
                alt="Design"
              />
            </div>
          </SwiperSlide>

          {/* IT Career */}
          <SwiperSlide>
            <div className="slide slide4">
              <div className="slide-content">
                <h1>IT & Software Careers</h1>

                <p>
                  Work with top tech companies worldwide.
                </p>

                <button>Explore Jobs →</button>
              </div>

              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80"
                alt="IT"
              />
            </div>
          </SwiperSlide>

        </Swiper>
      </div>
      {/* Slider End */}

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <h2>Popular Jobs Categories</h2>

          <div className="categories-grid">
            {categories.map((item, index) => (
              <Link
                key={index}
                to={`/categoryjob/${encodeURIComponent(item.name)}`}
                state={{ category: item.name }}
                className="category-card"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="category"
                />

                <h3>{item.name}</h3>
                <span>{item.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RecenthotsJob />
      <Footer></Footer>
    </div>
  );
}

export default Category;