import uuid

from django.core.validators import MinValueValidator
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('wedding_blueprint', '0002_event_recovery_rules'),
    ]

    operations = [
        migrations.CreateModel(
            name='Incident',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=200)),
                ('incident_type', models.CharField(max_length=50)),
                ('description', models.TextField(blank=True)),
                ('vendor_impact', models.CharField(blank=True, default='', max_length=200)),
                ('delay_minutes', models.PositiveIntegerField(validators=[MinValueValidator(1)])),
                ('cost_per_minute', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('status', models.CharField(choices=[('open', 'Open'), ('analyzed', 'Analyzed'), ('approved', 'Recovery Approved'), ('resolved', 'Resolved')], default='open', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('affected_event', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='disruption_incidents', to='wedding_blueprint.weddingevent')),
                ('wedding', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='disruption_incidents', to='wedding_blueprint.wedding')),
            ],
            options={'ordering': ['-created_at']},
        ),
        migrations.CreateModel(
            name='EventDependency',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('minimum_gap_minutes', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('predecessor_event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='outgoing_dependencies', to='wedding_blueprint.weddingevent')),
                ('successor_event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='incoming_dependencies', to='wedding_blueprint.weddingevent')),
                ('wedding', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='event_dependencies', to='wedding_blueprint.wedding')),
            ],
            options={'ordering': ['created_at']},
        ),
        migrations.CreateModel(
            name='RecoveryPlan',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('strategy', models.CharField(choices=[('minimum_disruption', 'Minimum Disruption'), ('time_preservation', 'Time Preservation'), ('cost_optimisation', 'Cost Optimisation')], max_length=30)),
                ('feasible', models.BooleanField(default=False)),
                ('changed_event_count', models.PositiveIntegerField(default=0)),
                ('estimated_additional_cost', models.DecimalField(decimal_places=2, default=0, max_digits=14)),
                ('impact_summary', models.JSONField(default=dict)),
                ('validation', models.JSONField(default=dict)),
                ('baseline_schedule', models.JSONField(default=list)),
                ('proposed_schedule', models.JSONField(default=list)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('incident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recovery_plans', to='disruption_engine.incident')),
            ],
            options={'ordering': ['created_at']},
        ),
        migrations.CreateModel(
            name='RecoveryHistory',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('action', models.CharField(max_length=40)),
                ('details', models.JSONField(default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('incident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='history', to='disruption_engine.incident')),
            ],
            options={'ordering': ['created_at']},
        ),
        migrations.AddConstraint(
            model_name='eventdependency',
            constraint=models.UniqueConstraint(fields=('predecessor_event', 'successor_event'), name='unique_wedding_event_dependency'),
        ),
    ]
