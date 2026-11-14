from datetime import datetime, timedelta, timezone

from app.models.otp_verification import OTPVerification

def delete_old_otp_records(db):
    try:
        # Calculate the date 7 days ago
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=7)

        # Delete records not updated in the last  7 days
        deleted_count = (
            db.query(OTPVerification)
            .filter(OTPVerification.updated_at < cutoff_date)
            .delete(synchronize_session=False)
        )

        db.commit()

        print(f"Deleted {deleted_count} old OTP records")

        return deleted_count

    except Exception as e:
        db.rollback()
        print("OTP cleanup failed:", e)
        raise