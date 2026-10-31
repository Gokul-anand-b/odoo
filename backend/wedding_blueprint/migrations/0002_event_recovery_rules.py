from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('wedding_blueprint', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='weddingevent',
            name='is_fixed_time',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='weddingevent',
            name='recovery_move_cost',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
    ]
