
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from app.database.connection import SessionLocal
from app.services.otp_cleanup_service import delete_old_otp_records
def run_otp_cleanup():
    db = SessionLocal()

    try:
        delete_old_otp_records(db)
    finally:
        db.close()


scheduler = BackgroundScheduler(timezone="Asia/Kolkata")


def start_scheduler():
    scheduler.add_job(
        run_otp_cleanup,
        trigger=CronTrigger(hour=13, minute=0),
        id="otp_cleanup_job",
        replace_existing=True
    )

    if not scheduler.running:
        scheduler.start()
