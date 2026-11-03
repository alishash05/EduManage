from app.database.connection import SessionLocal
from app.models.user import User
from app.core.security import hash_password


db = SessionLocal()

try:
    # Check whether Principal already exists
    existing_user = db.query(User).filter(
        User.email == "principal@edumanage.com"
    ).first()

    if existing_user:
        print("Principal account already exists!")

    else:
        principal = User(
            name="EduManage Principal",
            email="principal@edumanage.com",
            hashed_password=hash_password("Principal@123"),
            role="principal",
            is_active=True
        )

        db.add(principal)
        db.commit()
        db.refresh(principal)

        print("Principal account created successfully!")
        print("User ID:", principal.id)
        print("Email:", principal.email)
        print("Role:", principal.role)

except Exception as e:
    db.rollback()
    print("Error:", e)

finally:
    db.close()