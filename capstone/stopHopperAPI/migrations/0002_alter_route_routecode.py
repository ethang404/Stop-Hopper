# Generated by Django 4.0.3 on 2022-10-17 18:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stopHopperAPI', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='route',
            name='routeCode',
            field=models.CharField(default='zL22jt', max_length=6, unique=True),
        ),
    ]