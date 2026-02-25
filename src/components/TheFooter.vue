<template>
  <footer class="main-footer">
    <div class="footer-content">
      <div class="footer-logo">DINE享樂</div>
      <p class="copyright">
        &copy; 2026 DINE享樂. All Rights Reserved. 
        <span class="divider">|</span> 
        版權所有 翻印必究
      </p>

    </div>
  </footer>
</template>

<style scoped>
.main-footer {
  background-color: #ecdccb; 
  color: #ffffff;
  padding: 20px 10px;
  text-align: center;
  width: 100%;
  margin-top: auto; 
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ae5617; 
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.copyright {
  font-size: 0.9rem;
  color: #999;
  margin-bottom: 15px;
}

.divider {
  margin: 0 10px;
}

@media (max-width: 768px) {
  .footer-links {
    flex-direction: column;
    gap: 10px;
  }
}
</style>