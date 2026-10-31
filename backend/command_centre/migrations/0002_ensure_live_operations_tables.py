from django.db import migrations


def ensure_operations_tables(apps, schema_editor):
    EventOperations = apps.get_model('command_centre', 'EventOperations')
    WeddingVendorAssignment = apps.get_model('command_centre', 'WeddingVendorAssignment')
    existing_tables = set(schema_editor.connection.introspection.table_names())

    for model in (EventOperations, WeddingVendorAssignment):
        if model._meta.db_table not in existing_tables:
            schema_editor.create_model(model)
            existing_tables.add(model._meta.db_table)


class Migration(migrations.Migration):
    dependencies = [
        ('command_centre', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(ensure_operations_tables, migrations.RunPython.noop),
    ]
