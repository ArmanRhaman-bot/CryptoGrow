* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(180deg, #0A0C15 0%, #12141F 100%);
  color: #FFFFFF;
  min-height: 100vh;
}

.mobile-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 0 20px 90px 20px;
  position: relative;
}

/* Status Bar */
.status-bar {
  display: flex;
  justify-content: space-between;
  padding: 12px 0 8px;
  font-size: 14px;
  font-weight: 500;
  color: #8E9AAF;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.greeting {
  display: flex;
  align-items: center;
  gap: 12px;
}

.wave {
  font-size: 32px;
}

.greeting-text {
  font-size: 13px;
  color: #8E9AAF;
  letter-spacing: 0.3px;
}

.greeting h1 {
  font-size: 20px;
  font-weight: 700;
  margin-top: 2px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.icon-circle {
  width: 42px;
  height: 42px;
  background: rgba(30, 35, 55, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
  font-size: 18px;
}

.icon-circle:hover {
  background: rgba(139, 92, 246, 0.2);
  transform: scale(0.95);
}

/* User ID Badge */
.user-id-badge {
  background: rgba(30, 35, 55, 0.6);
  backdrop-filter: blur(8px);
  padding: 10px 16px;
  border-radius: 60px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.copy-id-btn {
  background: none;
  border: none;
  color: #8E9AAF;
  cursor: pointer;
  padding: 4px;
  transition: 0.2s;
}

.copy-id-btn:hover {
  color: #A855F7;
}

/* Stats Row */
.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  flex: 1;
  background: linear-gradient(135deg, #1A1D2E 0%, #151826 100%);
  border-radius: 24px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.purple {
  background: linear-gradient(135deg, #8B5CF6, #6D28D9);
}

.stat-icon.orange {
  background: linear-gradient(135deg, #F59E0B, #D97706);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: #8E9AAF;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
}

/* Check-in Card */
.checkin-card {
  background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
  border-radius: 28px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.checkin-content {
  display: flex;
  gap: 16px;
  align-items: center;
}

.checkin-icon {
  width: 52px;
  height: 52px;
  background: rgba(139, 92, 246, 0.15);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: #A855F7;
}

.checkin-text h3 {
  font-size: 18px;
  font-weight: 700;
}

.checkin-text p {
  font-size: 12px;
  color: #8E9AAF;
  margin-top: 4px;
}

.checkin-btn {
  background: linear-gradient(135deg, #8B5CF6, #6D28D9);
  border: none;
  padding: 12px 20px;
  border-radius: 40px;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.checkin-btn:hover {
  transform: scale(1.02);
  filter: brightness(1.05);
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 24px 0 16px 0;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-badge {
  background: rgba(139, 92, 246, 0.15);
  padding: 4px 10px;
  border-radius: 40px;
  font-size: 11px;
  font-weight: 600;
  color: #A855F7;
}

/* Quest List */
.quest-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quest-item {
  background: #151826;
  border-radius: 20px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s;
}

.quest-item:hover {
  background: #1A1D2E;
  transform: translateX(4px);
}

.quest-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.quest-icon.twitter-bg {
  background: #1DA1F2;
}
.quest-icon.telegram-bg {
  background: #26A5E4;
}
.quest-icon.share-bg {
  background: #10B981;
}

.quest-info {
  flex: 1;
}

.quest-info h4 {
  font-size: 15px;
  font-weight: 600;
}

.quest-info p {
  font-size: 11px;
  color: #8E9AAF;
  margin-top: 2px;
}

.quest-reward {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reward-amount {
  font-weight: 700;
  color: #F59E0B;
  font-size: 14px;
}

.checkbox-wrapper input {
  width: 22px;
  height: 22px;
  accent-color: #8B5CF6;
  cursor: pointer;
}

/* Referral Card */
.referral-card {
  background: linear-gradient(135deg, #1A1D2E, #131625);
  border-radius: 24px;
  padding: 20px;
  border: 1px solid rgba(139, 92, 246, 0.15);
}

.referral-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.referral-stat {
  text-align: center;
}

.stat-number {
  font-size: 28px;
  font-weight: 800;
  display: block;
  background: linear-gradient(135deg, #F59E0B, #FCD34D);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.referral-divider {
  width: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.referral-link-box {
  background: #0F111A;
  padding: 12px 16px;
  border-radius: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.ref-link {
  font-size: 12px;
  font-family: monospace;
  color: #A855F7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copy-link-btn {
  background: #8B5CF6;
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: 0.2s;
}

.copy-link-btn:hover {
  background: #6D28D9;
  transform: scale(0.95);
}

.referral-note {
  font-size: 11px;
  color: #8E9AAF;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Withdraw Premium Card */
.withdraw-premium-card {
  background: linear-gradient(135deg, #121624, #0E1018);
  border-radius: 28px;
  padding: 20px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  margin-top: 4px;
}

.balance-preview {
  position: relative;
  background: linear-gradient(135deg, #1A1D2E, #131625);
  border-radius: 24px;
  padding: 20px;
  margin-bottom: 24px;
  overflow: hidden;
}

.balance-glow {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent);
  border-radius: 50%;
}

.balance-content {
  position: relative;
  z-index: 1;
}

.balance-label {
  font-size: 12px;
  color: #8E9AAF;
  letter-spacing: 0.5px;
}

.balance-amount {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 12px 0 16px;
}

.currency-icon {
  font-size: 28px;
  color: #10B981;
}

.balance-amount span:first-of-type {
  font-size: 42px;
  font-weight: 800;
}

.currency-unit {
  font-size: 14px;
  color: #8E9AAF;
}

.progress-container {
  background: #0F111A;
  border-radius: 60px;
  height: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  background: linear-gradient(90deg, #10B981, #34D399);
  height: 100%;
  border-radius: 60px;
  transition: width 0.5s ease;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #8E9AAF;
}

.withdraw-options {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.withdraw-method {
  flex: 1;
  background: #0F111A;
  padding: 10px;
  text-align: center;
  border-radius: 16px;
  cursor: pointer;
  transition: 0.2s;
  border: 1px solid transparent;
}

.withdraw-method i {
  font-size: 20px;
  display: block;
  margin-bottom: 6px;
}

.withdraw-method span {
  font-size: 11px;
}

.withdraw-method.active {
  background: linear-gradient(135deg, #1A1D2E, #131625);
  border-color: #10B981;
  color: #10B981;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
  color: #8E9AAF;
}

.input-field {
  background: #0F111A;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.input-field i {
  color: #8E9AAF;
}

.input-field input {
  background: none;
  border: none;
  color: white;
  font-size: 14px;
  width: 100%;
  outline: none;
}

.input-field input::placeholder {
  color: #4A4F6A;
}

.withdraw-submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #10B981, #059669);
  border: none;
  padding: 16px;
  border-radius: 60px;
  color: white;
  font-weight: 700;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;
  margin: 8px 0 16px;
}

.withdraw-submit-btn:hover:not(:disabled) {
  transform: scale(1.01);
  filter: brightness(1.05);
}

.withdraw-submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.withdraw-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.fee-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #6B7280;
}

/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 400px;
  margin: 0 auto;
  background: rgba(18, 20, 31, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-around;
  padding: 12px 20px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.nav-item {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #5B6A8A;
  cursor: pointer;
  transition: 0.2s;
  font-size: 12px;
}

.nav-item i {
  font-size: 22px;
}

.nav-item.active {
  color: #A855F7;
}

/* Toast */
.toast-modern {
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: #1A1D2E;
  backdrop-filter: blur(12px);
  padding: 12px 24px;
  border-radius: 60px;
  font-size: 13px;
  font-weight: 500;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  white-space: nowrap;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.toast-modern.show {
  opacity: 1;
  visibility: visible;
}

/* Animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card, .quest-item, .referral-card, .withdraw-premium-card {
  animation: slideUp 0.4s ease forwards;
}