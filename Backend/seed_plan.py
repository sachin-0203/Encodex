from Backend.app import app
from Backend.db import db
from Backend.models import Plan

def seed_plans():
  with app.app_context():
    if Plan.query.count() == 0:
      plans = [
          
        Plan(
          name="Basic",
          price=49.0,
          duration_days=30,
          features={
            "downloads_per_month": 10,
            "priority_support": False,
            "storage": "2GB"
          }
        ),

        Plan(
          name="Pro",
          price=149.0,
          duration_days=90,
          features={
            "downloads_per_month": 50,
            "priority_support": True,
            "storage": "10GB"
          }
        ),

        Plan(
          name="Premium",
          price=299.0,
          duration_days=180,
          features={
            "downloads_per_month": "Unlimited",
            "priority_support": True,
            "storage": "50GB"
          }
        )
      ]


    for plan in plans:
      existing = Plan.query.filter_by(name=plan.name).first()
      if not existing:
        db.session.add(plan)

    db.session.commit() 
    print("Plans seeded successfully.")  


if __name__ == "__main__":
  seed_plans()