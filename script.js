// アプリケーションの状態管理
class ScheduleManager {
    constructor() {
        this.currentWeek = new Date();
        this.currentEquipment = 'projector';
        this.reservations = this.loadSampleData();
        this.equipmentData = {
            projector: { name: 'プロジェクター', icon: '📽️' },
            'conference-room': { name: '会議室', icon: '🏢' },
            laptop: { name: 'ノートパソコン', icon: '💻' },
            camera: { name: 'カメラ', icon: '📷' },
            microphone: { name: 'マイク', icon: '🎤' }
        };
        this.timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.renderSchedule();
        this.updateCurrentWeek();
    }
    
    // サンプルデータを生成
    loadSampleData() {
        const reservations = [];
        const today = new Date();
        
        // サンプル予約データ
        const sampleReservations = [
            {
                id: 1,
                equipment: 'projector',
                title: '営業会議',
                user: '田中太郎',
                date: this.formatDate(today),
                startTime: '10:00',
                endTime: '12:00',
                notes: 'プレゼンテーション用'
            },
            {
                id: 2,
                equipment: 'projector',
                title: '研修',
                user: '佐藤花子',
                date: this.formatDate(new Date(today.getTime() + 86400000)), // 明日
                startTime: '14:00',
                endTime: '16:00',
                notes: '新人研修'
            },
            {
                id: 3,
                equipment: 'conference-room',
                title: '役員会議',
                user: '山田部長',
                date: this.formatDate(today),
                startTime: '13:00',
                endTime: '15:00',
                notes: '機密事項'
            }
        ];
        
        return sampleReservations;
    }
    
    // イベントバインディング
    bindEvents() {
        // 備品選択
        document.querySelectorAll('.equipment-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectEquipment(e.currentTarget.dataset.equipment);
            });
        });
        
        // 週ナビゲーション
        document.getElementById('prevWeek').addEventListener('click', () => {
            this.navigateWeek(-1);
        });
        
        document.getElementById('nextWeek').addEventListener('click', () => {
            this.navigateWeek(1);
        });
        
        // 新規予約ボタン
        document.getElementById('addReservationBtn').addEventListener('click', () => {
            this.openReservationModal();
        });
        
        // モーダル関連
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeReservationModal();
        });
        
        document.getElementById('cancelReservation').addEventListener('click', () => {
            this.closeReservationModal();
        });
        
        // モーダル外クリックで閉じる
        document.getElementById('reservationModal').addEventListener('click', (e) => {
            if (e.target.id === 'reservationModal') {
                this.closeReservationModal();
            }
        });
        
        // 予約フォーム送信
        document.getElementById('reservationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReservation();
        });
        
        // フィルター
        document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.renderSchedule();
            });
        });
        
        // 全体表示ボタン
        document.getElementById('viewAllBtn').addEventListener('click', () => {
            this.showAllEquipment();
        });
        
        // エクスポートボタン
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportSchedule();
        });
    }
    
    // 備品選択
    selectEquipment(equipmentId) {
        // アクティブ状態を更新
        document.querySelectorAll('.equipment-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-equipment="${equipmentId}"]`).classList.add('active');
        
        this.currentEquipment = equipmentId;
        this.updateHeaderTitle();
        this.renderSchedule();
    }
    
    // ヘッダータイトル更新
    updateHeaderTitle() {
        const equipment = this.equipmentData[this.currentEquipment];
        document.getElementById('currentEquipment').textContent = `${equipment.name} - 予定表`;
    }
    
    // 週ナビゲーション
    navigateWeek(direction) {
        const newDate = new Date(this.currentWeek);
        newDate.setDate(newDate.getDate() + (direction * 7));
        this.currentWeek = newDate;
        this.updateCurrentWeek();
        this.renderSchedule();
    }
    
    // 現在の週表示を更新
    updateCurrentWeek() {
        const monday = this.getMonday(this.currentWeek);
        const sunday = new Date(monday);
        sunday.setDate(sunday.getDate() + 6);
        
        const weekText = `${this.formatDateDisplay(monday)} - ${this.formatDateDisplay(sunday)}`;
        document.getElementById('currentWeek').textContent = weekText;
    }
    
    // 月曜日を取得
    getMonday(date) {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    }
    
    // スケジュール表示
    renderSchedule() {
        const container = document.getElementById('daysContainer');
        container.innerHTML = '';
        
        const monday = this.getMonday(new Date(this.currentWeek));
        
        // 7日分の列を作成
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(date.getDate() + i);
            
            const dayColumn = this.createDayColumn(date);
            container.appendChild(dayColumn);
        }
    }
    
    // 日付列を作成
    createDayColumn(date) {
        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column';
        
        const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
        const dayName = dayNames[date.getDay()];
        
        // ヘッダー
        const header = document.createElement('div');
        header.className = 'day-header';
        header.innerHTML = `
            <div class="day-name">${dayName}</div>
            <div class="day-date">${date.getDate()}</div>
        `;
        dayColumn.appendChild(header);
        
        // 時間スロット
        this.timeSlots.forEach(time => {
            const slot = this.createTimeSlot(date, time);
            dayColumn.appendChild(slot);
        });
        
        return dayColumn;
    }
    
    // 時間スロットを作成
    createTimeSlot(date, time) {
        const slot = document.createElement('div');
        slot.className = 'schedule-slot available';
        slot.dataset.date = this.formatDate(date);
        slot.dataset.time = time;
        
        // この時間に予約があるかチェック
        const reservation = this.findReservation(date, time);
        if (reservation) {
            slot.classList.remove('available');
            slot.classList.add('reserved');
            
            const reservationDiv = document.createElement('div');
            reservationDiv.className = 'reservation';
            reservationDiv.innerHTML = `
                <div class="reservation-title">${reservation.title}</div>
                <div class="reservation-user">${reservation.user}</div>
            `;
            
            // 予約クリックイベント
            reservationDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showReservationDetails(reservation);
            });
            
            slot.appendChild(reservationDiv);
        } else {
            // 空きスロットクリックイベント
            slot.addEventListener('click', () => {
                this.openReservationModal(date, time);
            });
        }
        
        return slot;
    }
    
    // 予約を検索
    findReservation(date, time) {
        const dateStr = this.formatDate(date);
        return this.reservations.find(reservation => 
            reservation.equipment === this.currentEquipment &&
            reservation.date === dateStr &&
            this.isTimeInRange(time, reservation.startTime, reservation.endTime)
        );
    }
    
    // 時間が範囲内かチェック
    isTimeInRange(time, startTime, endTime) {
        return time >= startTime && time < endTime;
    }
    
    // 予約モーダルを開く
    openReservationModal(date = null, time = null) {
        const modal = document.getElementById('reservationModal');
        
        // フォームをリセット
        document.getElementById('reservationForm').reset();
        
        // 日付と時間を事前設定
        if (date) {
            document.getElementById('reservationDate').value = this.formatDate(date);
        }
        if (time) {
            document.getElementById('reservationStartTime').value = time;
            // 終了時間を1時間後に設定
            const endTimeIndex = this.timeSlots.indexOf(time) + 1;
            if (endTimeIndex < this.timeSlots.length) {
                document.getElementById('reservationEndTime').value = this.timeSlots[endTimeIndex];
            }
        }
        
        modal.style.display = 'block';
    }
    
    // 予約モーダルを閉じる
    closeReservationModal() {
        document.getElementById('reservationModal').style.display = 'none';
    }
    
    // 予約を送信
    submitReservation() {
        const form = document.getElementById('reservationForm');
        const formData = new FormData(form);
        
        const reservation = {
            id: Date.now(),
            equipment: this.currentEquipment,
            title: document.getElementById('reservationTitle').value,
            user: document.getElementById('reservationUser').value,
            date: document.getElementById('reservationDate').value,
            startTime: document.getElementById('reservationStartTime').value,
            endTime: document.getElementById('reservationEndTime').value,
            notes: document.getElementById('reservationNotes').value
        };
        
        // 時間の重複チェック
        if (this.isReservationConflict(reservation)) {
            alert('指定した時間帯は既に予約済みです。別の時間を選択してください。');
            return;
        }
        
        // 開始時間と終了時間の妥当性チェック
        if (reservation.startTime >= reservation.endTime) {
            alert('終了時間は開始時間より後に設定してください。');
            return;
        }
        
        this.reservations.push(reservation);
        this.closeReservationModal();
        this.renderSchedule();
        
        // 成功メッセージ
        alert(`予約が完了しました。\n${reservation.title} (${reservation.date} ${reservation.startTime}-${reservation.endTime})`);
    }
    
    // 予約の重複チェック
    isReservationConflict(newReservation) {
        return this.reservations.some(existing => 
            existing.equipment === newReservation.equipment &&
            existing.date === newReservation.date &&
            !(newReservation.endTime <= existing.startTime || newReservation.startTime >= existing.endTime)
        );
    }
    
    // 予約詳細表示
    showReservationDetails(reservation) {
        const message = `
予約詳細:
タイトル: ${reservation.title}
予約者: ${reservation.user}
日付: ${reservation.date}
時間: ${reservation.startTime} - ${reservation.endTime}
備考: ${reservation.notes || 'なし'}
        `;
        
        if (confirm(message + '\n\nこの予約を削除しますか？')) {
            this.deleteReservation(reservation.id);
        }
    }
    
    // 予約削除
    deleteReservation(reservationId) {
        this.reservations = this.reservations.filter(r => r.id !== reservationId);
        this.renderSchedule();
        alert('予約を削除しました。');
    }
    
    // 全備品表示
    showAllEquipment() {
        alert('全備品の予約状況を表示する機能は今後実装予定です。');
    }
    
    // スケジュールエクスポート
    exportSchedule() {
        const data = {
            equipment: this.currentEquipment,
            week: document.getElementById('currentWeek').textContent,
            reservations: this.reservations.filter(r => r.equipment === this.currentEquipment)
        };
        
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `schedule_${this.currentEquipment}_${this.formatDate(new Date())}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // ユーティリティ関数
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    
    formatDateDisplay(date) {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
}

// DOM読み込み完了後にアプリケーション開始
document.addEventListener('DOMContentLoaded', () => {
    new ScheduleManager();
    
    // パフォーマンス向上のためのレイジーローディング
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                }
            });
        });
        
        document.querySelectorAll('.schedule-slot').forEach(slot => {
            observer.observe(slot);
        });
    }
    
    // ショートカットキー
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'n':
                    e.preventDefault();
                    document.getElementById('addReservationBtn').click();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    document.getElementById('prevWeek').click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    document.getElementById('nextWeek').click();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            document.getElementById('closeModal').click();
        }
    });
});

// Service Worker登録（オフライン対応）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}