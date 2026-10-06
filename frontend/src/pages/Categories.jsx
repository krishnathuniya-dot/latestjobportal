
import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import "../css/Categories.css";
import RecenthotsJob from "./Recenthotsjob";
import Footer from "./Footer";

const categories = [
  {
    name: "Design",
    count: 1,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=85",
    icon: "🎨",
    color: "#ec4899",
    bg: "linear-gradient(135deg, #fff1f6 0%, #ffd6e7 100%)",
  },
  {
    name: "Marketing",
    count: 2,
    image:
      "https://images.unsplash.com/photo-1557838923-2985c318be48?w=700&q=85",
    icon: "📢",
    color: "#f59e0b",
    bg: "linear-gradient(135deg, #fff8e7 0%, #ffe4b5 100%)",
  },
  {
    name: "IT",
    count: 2,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=85",
    icon: "💻",
    color: "#3b82f6",
    bg: "linear-gradient(135deg, #edf7ff 0%, #cce9ff 100%)",
  },
  {
    name: "Operations",
    count: 1,
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=700&q=85",
    icon: "⚙️",
    color: "#10b981",
    bg: "linear-gradient(135deg, #edfff7 0%, #c9f9df 100%)",
  },
  {
    name: "Product Manager",
    count: 1,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=85",
    icon: "📊",
    color: "#a855f7",
    bg: "linear-gradient(135deg, #f8f1ff 0%, #e9d5ff 100%)",
  },
  {
    name: "Software Developer",
    count: 3,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&q=85",
    icon: "👨‍💻",
    color: "#06b6d4",
    bg: "linear-gradient(135deg, #ecfeff 0%, #c9f9ff 100%)",
  },
  {
    name: "Human Resources",
    count: 2,
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=700&q=85",
    icon: "👥",
    color: "#ef4444",
    bg: "linear-gradient(135deg, #fff1f1 0%, #ffd4d4 100%)",
  },
  {
    name: "Finance",
    count: 1,
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&q=85",
    icon: "💰",
    color: "#14b8a6",
    bg: "linear-gradient(135deg, #edfffc 0%, #c8f7ef 100%)",
  },
];

function Category() {
  return (
    <div className="job-portal">

      {/* ================= SLIDER ================= */}
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

          {/* Slide 1 */}
          <SwiperSlide>
            <div className="slide slide1">
              <div className="slide-content">
                <span className="slide-badge">🚀 Career Opportunity</span>
                <h1>Become a Full Stack Developer</h1>
                <p>
                  Build powerful web applications with modern technologies
                  and start your dream tech career.
                </p>

                <Link to="/jobs">
                  <button>Explore Jobs →</button>
                </Link>
              </div>

              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=85"
                alt="Full Stack Developer"
              />
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div className="slide slide2">
              <div className="slide-content">
                <span className="slide-badge">📢 Trending Career</span>
                <h1>Digital Marketing Career</h1>
                <p>
                  Reach more customers, grow brands and build an exciting
                  career in digital marketing.
                </p>

                <Link to="/jobs">
                  <button>Explore Jobs →</button>
                </Link>
              </div>

              <img
                src="https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&q=85"
                alt="Digital Marketing"
              />
            </div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <div className="slide slide3">
              <div className="slide-content">
                <span className="slide-badge">✨ Creative Careers</span>
                <h1>Creative UI / UX Design</h1>
                <p>
                  Turn creative ideas into beautiful digital experiences
                  that people love to use.
                </p>

                <Link to="/jobs">
                  <button>Explore Jobs →</button>
                </Link>
              </div>

              <img
                src="https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&q=85"
                alt="UI UX Design"
              />
            </div>
          </SwiperSlide>

          {/* Slide 4 */}
          <SwiperSlide>
            <div className="slide slide4">
              <div className="slide-content">
                <span className="slide-badge">💻 Tech Jobs</span>
                <h1>IT &amp; Software Careers</h1>
                <p>
                  Find opportunities with innovative companies and take your
                  technology career to the next level.
                </p>

                <Link to="/jobs">
                  <button>Explore Jobs →</button>
                </Link>
              </div>

              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=85"
                alt="IT Software Careers"
              />
            </div>
          </SwiperSlide>

        </Swiper>
      </div>

      {/* ================= CATEGORIES ================= */}
      <section className="categories-section">

        <div className="container">

          <div className="section-header">

            <div className="section-title-wrapper">
              <span className="section-tag">
                🔥 Explore Opportunities
              </span>

              <h2>Popular Job Categories</h2>

              <p>
                Discover exciting career opportunities and find the perfect
                job that matches your skills, experience and passion.
              </p>
            </div>

            <Link to="/jobs" className="view-all-btn">
              View All Jobs →
            </Link>

          </div>

          {/* Category Cards */}
          <div className="categories-grid">

            {categories.map((item, index) => (

              <Link
                key={index}
                to={`/categoryjob/${encodeURIComponent(item.name)}`}
                state={{ category: item.name }}
                className="category-card"
                style={{
                  "--card-color": item.color,
                  "--card-bg": item.bg,
                }}
              >

                {/* Image */}
                <div className="category-image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="category-icon">
                    {item.icon}
                  </div>

                  <div className="job-badge">
                    {item.count} {item.count === 1 ? "Job" : "Jobs"}
                  </div>

                </div>

                {/* Content */}
                <div className="category-content">

                  <h3>{item.name}</h3>

                  <p>
                    Explore {item.name.toLowerCase()} opportunities
                  </p>

                  <div className="category-footer">

                    <span>
                      View Opportunities
                    </span>

                    <span className="category-arrow">
                      →
                    </span>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </section>

      {/* ================= RECENT JOBS ================= */}
      <RecenthotsJob />

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
}

export default Category;
