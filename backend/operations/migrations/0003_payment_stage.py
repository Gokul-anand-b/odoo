from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('operations', '0002_alter_agreement_options_alter_document_options_and_more'),
    ]

    operations = [
        migrations.RunSQL(
            sql=(
                "ALTER TABLE operations_payment ADD COLUMN IF NOT EXISTS "
                "payment_stage varchar(20) NOT NULL DEFAULT 'booking'"
            ),
            reverse_sql="ALTER TABLE operations_payment DROP COLUMN IF EXISTS payment_stage",
        ),
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.AddField(
                    model_name='payment',
                    name='payment_stage',
                    field=models.CharField(
                        choices=[
                            ('booking', 'Booking'),
                            ('advance', 'Advance'),
                            ('final', 'Final'),
                            ('settlement', 'Settlement'),
                        ],
                        default='booking',
                        max_length=20,
                    ),
                ),
            ],
        ),
    ]
