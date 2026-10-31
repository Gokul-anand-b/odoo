import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('vendor_intelligence', '0001_initial'),
        ('wedding_blueprint', '0002_event_recovery_rules'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventOperations',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(choices=[('upcoming', 'Upcoming'), ('in_progress', 'In progress'), ('completed', 'Completed'), ('delayed', 'Delayed')], default='upcoming', max_length=20)),
                ('actual_start', models.DateTimeField(blank=True, null=True)),
                ('actual_end', models.DateTimeField(blank=True, null=True)),
                ('delay_reason', models.TextField(blank=True, default='')),
                ('event', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='operations', to='wedding_blueprint.weddingevent')),
            ],
            options={
                'abstract': False,
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='WeddingVendorAssignment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('expected_arrival', models.DateTimeField(blank=True, null=True)),
                ('actual_arrival', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(choices=[('expected', 'Expected'), ('en_route', 'En route'), ('checked_in', 'Checked in'), ('delayed', 'Delayed')], default='expected', max_length=20)),
                ('notes', models.TextField(blank=True, default='')),
                ('event', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='vendor_operations_assignments', to='wedding_blueprint.weddingevent')),
                ('vendor', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='wedding_operations_assignments', to='vendor_intelligence.vendor')),
                ('wedding', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='command_centre_vendor_assignments', to='wedding_blueprint.wedding')),
            ],
            options={
                'ordering': ['expected_arrival', 'vendor__name'],
            },
        ),
        migrations.AddConstraint(
            model_name='weddingvendorassignment',
            constraint=models.UniqueConstraint(fields=('wedding', 'vendor'), name='unique_command_centre_vendor_per_wedding'),
        ),
    ]
