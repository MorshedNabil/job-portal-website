from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0001_initial'),
    ]

    operations = [
        migrations.AddField(model_name='job', name='vacancy',          field=models.PositiveIntegerField(blank=True, null=True)),
        migrations.AddField(model_name='job', name='age_range',        field=models.CharField(blank=True, max_length=100)),
        migrations.AddField(model_name='job', name='experience',       field=models.CharField(blank=True, max_length=200)),
        migrations.AddField(model_name='job', name='deadline',         field=models.DateField(blank=True, null=True)),
        migrations.AddField(model_name='job', name='education',        field=models.TextField(blank=True)),
        migrations.AddField(model_name='job', name='skills',           field=models.TextField(blank=True)),
        migrations.AddField(model_name='job', name='requirements',     field=models.TextField(blank=True)),
        migrations.AddField(model_name='job', name='responsibilities', field=models.TextField(blank=True)),
        migrations.AddField(model_name='job', name='company_name',    field=models.CharField(blank=True, max_length=200)),
        migrations.AddField(model_name='job', name='company_about',   field=models.TextField(blank=True)),
        migrations.AddField(model_name='job', name='company_address', field=models.CharField(blank=True, max_length=300)),
    ]
